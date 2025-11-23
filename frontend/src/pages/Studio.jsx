import { useEffect, useState } from "react";
import { studioApi } from "../api";

export default function Studio() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    studioApi.get('/rooms').then(res => setRooms(res.data));
  }, []);

  return (
    <div>
      <h1 className='text-2xl font-bold mb-4'>Danh sách phòng</h1>

      <div className='grid grid-cols-3 gap-4'>
        {rooms.map(room => (
          <div key={room._id} className='card bg-base-100 p-4 shadow'>
            <h2 className='text-xl'>Phòng {room.room_number}</h2>
            <p>Đã đặt: {room.occupied_on.length} slot</p>
          </div>
        ))}
      </div>
    </div>
  );
}
