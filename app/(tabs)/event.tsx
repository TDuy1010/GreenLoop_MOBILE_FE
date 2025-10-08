import React, { useMemo, useState, useCallback } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import {
    Text,
    View,
    TouchableOpacity,
    Alert,
    FlatList,
    Dimensions,
    Linking,
    Platform,
    ScrollView
} from "react-native";
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface EventMarker {
    id: string;
    name: string;
    location: string;
    distance: number;
    status: 'upcoming' | 'ongoing' | 'ended';
    latitude: number;
    longitude: number;
}

// Mock data
const EVENT_MARKERS: EventMarker[] = [
    {
        id: '1',
        name: 'Thu gom quần áo cũ - Quận 1',
        location: 'TTTM Vincom Center',
        distance: 2.5,
        status: 'ongoing',
        latitude: 10.7769,
        longitude: 106.7009
    },
    {
        id: '2',
        name: 'Ngày hội thời trang xanh',
        location: 'Trung tâm Văn hóa Thanh Niên',
        distance: 4.8,
        status: 'upcoming',
        latitude: 10.7835,
        longitude: 106.6924
    },
    {
        id: '3',
        name: 'Trao đổi đồ cũ',
        location: 'Công viên Tao Đàn',
        distance: 3.2,
        status: 'upcoming',
        latitude: 10.7756,
        longitude: 106.6917
    },
    {
        id: '4',
        name: 'Phiên chợ đồ cũ cuối tuần',
        location: 'Nhà văn hóa Lao Động',
        distance: 6.1,
        status: 'ended',
        latitude: 10.7722,
        longitude: 106.6987
    }
];

export default function EventMapScreen() {
    const [showMap, setShowMap] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<EventMarker | null>(null);

    // Chỉ hiển thị sự kiện "đang có": ongoing trước rồi tới upcoming; cùng trạng thái thì gần hơn trước
    const availableEvents = useMemo(() => {
        const active = EVENT_MARKERS.filter(e => e.status !== 'ended');
        const rank = (s: EventMarker['status']) => (s === 'ongoing' ? 0 : s === 'upcoming' ? 1 : 2);
        return active.sort((a, b) => (rank(a.status) - rank(b.status)) || (a.distance - b.distance));
    }, []);

    const getStatusColor = (status: EventMarker['status']) => {
        switch (status) {
            case 'ongoing': return '#16A34A';
            case 'upcoming': return '#3B82F6';
            case 'ended': return '#9CA3AF';
        }
    };

    const openExternalMaps = useCallback((ev: EventMarker) => {
        const { latitude, longitude, location } = ev;
        const label = encodeURIComponent(`${ev.name} - ${location}`);
        const url = Platform.select({
            ios: `http://maps.apple.com/?ll=${latitude},${longitude}&q=${label}`,
            android: `geo:${latitude},${longitude}?q=${label}`
        })!;
        Linking.openURL(url).catch(() => {
            Alert.alert('Không thể mở bản đồ', 'Vui lòng kiểm tra ứng dụng bản đồ trên máy.');
        });
    }, []);

    // Chuyển sang Map Mode (nếu chưa có chọn thì chọn event đầu)
    const openMapMode = useCallback((ev?: EventMarker) => {
        const target = ev ?? availableEvents[0] ?? null;
        setSelectedEvent(target);
        setShowMap(true);
    }, [availableEvents]);

    // Đóng Map Mode → quay về danh sách (không back screen)
    const handleCloseMap = useCallback(() => {
        setShowMap(false);
        setSelectedEvent(null);
    }, []);

    // ----- MARKER TAP TRONG MAP (placeholder) -----
    const handleMarkerPress = (event: EventMarker) => setSelectedEvent(event);

    // ----- RENDER ITEM DANH SÁCH -----
    const renderEventItem = ({ item }: { item: EventMarker }) => (
        <View className="bg-white rounded-2xl p-4 mb-3 mx-5 border border-gray-100">
            <View className="flex-row justify-between items-start">
                <View className="flex-1 pr-3">
                    <Text className="font-quicksandBold text-gray-900 text-base" numberOfLines={2}>
                        {item.name}
                    </Text>
                    <View className="flex-row items-center mt-1">
                        <Ionicons name="location-outline" size={16} color="#6B7280" />
                        <Text className="font-quicksand text-sm text-gray-600 ml-1" numberOfLines={1}>
                            {item.location}
                        </Text>
                    </View>
                    <View className="flex-row items-center mt-2">
                        <View className="bg-gray-100 rounded-full px-2.5 py-1 mr-2">
                            <Text className="font-quicksandBold text-gray-700 text-xs">{item.distance}km</Text>
                        </View>
                        <View className="px-2.5 py-1 rounded-full" style={{ backgroundColor: getStatusColor(item.status) }}>
                            <Text className="font-quicksandBold text-white text-xs">
                                {item.status === 'ongoing' ? 'Đang diễn ra' : item.status === 'upcoming' ? 'Sắp tới' : 'Đã kết thúc'}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Icon mở map cho item này */}
                <View className="items-center">
                    <TouchableOpacity
                        onPress={() => openMapMode(item)}
                        className="w-10 h-10 rounded-full bg-green-50 items-center justify-center"
                        activeOpacity={0.8}
                    >
                        <Ionicons name="map" size={22} color="#16A34A" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => openExternalMaps(item)}
                        className="mt-2 px-3 py-1.5 rounded-full bg-green-600"
                        activeOpacity={0.85}
                    >
                        <Text className="font-quicksandBold text-white text-xs">Chỉ đường</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="bg-white px-5 py-4 flex-row items-center justify-between border-b border-gray-100">
                <View className="flex-row items-center">
                    {/* Chỉ hiện X khi ở Map Mode; ở List Mode để View rỗng cho ổn định layout */}
                    {showMap ? (
                        <TouchableOpacity onPress={handleCloseMap} className="w-10 h-10 items-center justify-center -ml-2">
                            <Ionicons name="close" size={28} color="#374151" />
                        </TouchableOpacity>
                    ) : (
                        <View style={{ width: 40 }} />
                    )}

                    <Text className="font-quicksandBold text-xl text-gray-800 ml-2">
                        {showMap ? 'Bản đồ sự kiện' : 'Sự kiện đang có'}
                    </Text>
                </View>

                {/* Đổi chế độ list <-> map */}
                <TouchableOpacity
                    onPress={() => (showMap ? handleCloseMap() : openMapMode())}
                    className="w-10 h-10 items-center justify-center"
                >
                    <Ionicons name={showMap ? 'list' : 'map'} size={24} color="#16A34A" />
                </TouchableOpacity>
            </View>

            {/* ======= LIST MODE (mặc định) ======= */}
            {!showMap && (
                <FlatList
                    data={availableEvents}
                    keyExtractor={(item) => item.id}
                    renderItem={renderEventItem}
                    ListHeaderComponent={
                        <View className="px-5 pt-4 pb-2">
                            <Text className="font-quicksand text-gray-600 text-sm">
                                Tìm thấy <Text className="font-quicksandBold text-gray-800">{availableEvents.length}</Text> sự kiện gần bạn
                            </Text>
                        </View>
                    }
                    ListEmptyComponent={
                        <View className="items-center justify-center py-24">
                            <Ionicons name="calendar-outline" size={54} color="#9CA3AF" />
                            <Text className="font-quicksandBold text-gray-600 mt-3">Chưa có sự kiện nào</Text>
                        </View>
                    }
                    contentContainerStyle={{ paddingBottom: 16 }}
                />
            )}

            {/* ======= MAP MODE (placeholder – thay bằng react-native-maps sau) ======= */}
            {showMap && (
                <>
                    <View className="flex-1 bg-gray-200 relative">
                        {/* Placeholder map */}
                        <View className="flex-1 items-center justify-center">
                            <Ionicons name="map-outline" size={80} color="#9CA3AF" />
                            <Text className="font-quicksandBold text-gray-600 mt-4 text-center px-10">
                                Tích hợp Google Maps sẽ hiển thị ở đây
                            </Text>
                            <Text className="font-quicksand text-sm text-gray-500 mt-2 text-center px-10">
                                Cài đặt react-native-maps để sử dụng bản đồ thực tế
                            </Text>
                        </View>

                        {/* Mock markers (chỉ sự kiện đang có) */}
                        {EVENT_MARKERS.filter(e => e.status !== 'ended').map((event, index) => (
                            <TouchableOpacity
                                key={event.id}
                                onPress={() => setSelectedEvent(event)}
                                style={{
                                    position: 'absolute',
                                    left: `${30 + index * 20}%`,
                                    top: `${30 + index * 15}%`,
                                }}
                                className="items-center"
                            >
                                <View
                                    className="w-10 h-10 rounded-full items-center justify-center shadow-lg"
                                    style={{ backgroundColor: getStatusColor(event.status) }}
                                >
                                    <Ionicons name="location" size={24} color="white" />
                                </View>
                                {selectedEvent?.id === event.id && (
                                    <View className="absolute -bottom-1 w-2 h-2 rounded-full bg-white" />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Bottom sheet info */}
                    {selectedEvent && (
                        <View className="bg-white rounded-t-3xl shadow-2xl" style={{ maxHeight: '40%' }}>
                            <View className="items-center py-2">
                                <View className="w-12 h-1 bg-gray-300 rounded-full" />
                            </View>

                            <ScrollView className="px-5 pb-5">
                                <View className="flex-row items-start justify-between mb-3">
                                    <View className="flex-1 mr-3">
                                        <Text className="font-quicksandBold text-xl text-gray-800 mb-1">
                                            {selectedEvent.name}
                                        </Text>
                                        <View className="flex-row items-center">
                                            <Ionicons name="location-outline" size={16} color="#6B7280" />
                                            <Text className="font-quicksand text-sm text-gray-600 ml-1">
                                                {selectedEvent.location}
                                            </Text>
                                        </View>
                                    </View>

                                    <View className="bg-green-50 px-3 py-1.5 rounded-full">
                                        <Text className="font-quicksandBold text-green-600 text-xs">
                                            {selectedEvent.distance}km
                                        </Text>
                                    </View>
                                </View>

                                <View className="flex-row gap-3">
                                    <TouchableOpacity
                                        onPress={() => openExternalMaps(selectedEvent)}
                                        className="flex-1 bg-green-600 py-3 rounded-xl flex-row items-center justify-center"
                                        activeOpacity={0.85}
                                    >
                                        <Ionicons name="navigate" size={20} color="white" />
                                        <Text className="font-quicksandBold text-white ml-2">Chỉ đường</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        className="flex-1 bg-gray-100 py-3 rounded-xl flex-row items-center justify-center"
                                        activeOpacity={0.85}
                                    >
                                        <Ionicons name="information-circle-outline" size={20} color="#374151" />
                                        <Text className="font-quicksandBold text-gray-800 ml-2">Chi tiết</Text>
                                    </TouchableOpacity>
                                </View>
                            </ScrollView>
                        </View>
                    )}

                    {/* Legend */}
                    <View className="absolute top-20 right-4 bg-white rounded-xl p-3 shadow-md">
                        <View className="flex-row items-center mb-2">
                            <View className="w-3 h-3 rounded-full bg-green-600 mr-2" />
                            <Text className="font-quicksand text-xs text-gray-700">Đang diễn ra</Text>
                        </View>
                        <View className="flex-row items-center mb-2">
                            <View className="w-3 h-3 rounded-full bg-blue-500 mr-2" />
                            <Text className="font-quicksand text-xs text-gray-700">Sắp tới</Text>
                        </View>
                        <View className="flex-row items-center">
                            <View className="w-3 h-3 rounded-full bg-gray-400 mr-2" />
                            <Text className="font-quicksand text-xs text-gray-700">Đã kết thúc</Text>
                        </View>
                    </View>
                </>
            )}
        </SafeAreaView>
    );
}
