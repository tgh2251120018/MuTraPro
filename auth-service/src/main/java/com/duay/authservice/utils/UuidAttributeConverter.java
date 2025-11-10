package com.duay.authservice.utils;

import java.nio.ByteBuffer;
import java.util.UUID;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true) // autoApply = true để JPA tự dùng cho tất cả các field UUID
public class UuidAttributeConverter implements AttributeConverter<UUID, byte[]> {

    /**
     * Chuyển từ UUID (Java) sang byte[] (Database)
     */
    @Override
    public byte[] convertToDatabaseColumn(UUID uuid) {
        if (uuid == null) {
            return null;
        }
        // Chuyển UUID (128 bits) thành mảng 16-byte
        ByteBuffer bb = ByteBuffer.wrap(new byte[16]);
        bb.putLong(uuid.getMostSignificantBits());
        bb.putLong(uuid.getLeastSignificantBits());
        return bb.array();
    }

    /**
     * Chuyển từ byte[] (Database) sang UUID (Java)
     */
    @Override
    public UUID convertToEntityAttribute(byte[] bytes) { // <-- ĐÃ SỬA: Kiểu trả về là UUID
        if (bytes == null || bytes.length != 16) {
            return null;
        }
        // Chuyển mảng 16-byte ngược lại thành UUID
        ByteBuffer bb = ByteBuffer.wrap(bytes);
        long firstLong = bb.getLong();
        long secondLong = bb.getLong();
        return new UUID(firstLong, secondLong); // <-- Bây giờ hoàn toàn hợp lệ
    }
}
