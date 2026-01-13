import ScheduleForm from './ScheduleForm';

const TimelineItem = ({ item, onEdit, onDelete, isEditing, editingSchedule, onSaveEdit, onCancelEdit }) => {
  const format12Hour = (timeStr) => {
    if (!timeStr) return '';
    let [hours, minutes] = timeStr.split(':');
    hours = parseInt(hours);
    const ampm = hours >= 12 ? '오후' : '오전';
    const displayHours = hours % 12 || 12;
    return `${ampm} ${displayHours}:${minutes}`;
  };

  const badgeColors = {
    'badge-flight': 'bg-accent-orange',
    'badge-hotel': 'bg-green-500',
    'badge-car': 'bg-accent-purple',
    'badge-food': 'bg-accent-red',
    'badge-cafe': 'bg-accent-teal',
    'badge-normal': 'bg-gray-500',
  };

  const badgeClass = `${badgeColors[item.type] || 'bg-gray-500'} text-xs text-white py-0.5 px-1.5 rounded-md inline-block mb-1`;

  if (isEditing) {
    return (
      <div className="mb-4">
        <ScheduleForm 
          editingSchedule={editingSchedule}
          onSave={onSaveEdit}
          onCancel={onCancelEdit}
        />
      </div>
    );
  }

  const handleNavigation = (e) => {
    e.preventDefault();

    if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) {
      // SDK not loaded or API key missing, fallback to search
      window.open(`https://map.kakao.com/link/search/${encodeURIComponent(item.location)}`, '_blank');
      return;
    }

    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.addressSearch(item.location, (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const { y: lat, x: lng } = result[0];
        const name = item.title;
        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

        if (isMobile) {
          // Direct navigation via KakaoNavi app
          window.location.href = `kakaonavi://navigate?name=${encodeURIComponent(name)}&x=${lng}&y=${lat}&coord_type=wgs84`;
        } else {
          // Web navigation for PC
          const url = `https://map.kakao.com/link/to/${encodeURIComponent(name)},${lat},${lng}`;
          window.open(url, '_blank');
        }
      } else {
        // Geocoding failed, fallback to name search
        console.warn('Geocoding failed, falling back to search');
        window.open(`https://map.kakao.com/link/search/${encodeURIComponent(item.location)}`, '_blank');
      }
    });
  };

  return (
    <div className="bg-card-bg rounded-xl p-4 mb-2.5 shadow-md flex items-center relative group">
      <div className="absolute right-2.5 top-2.5 flex gap-1.5">
        <button onClick={() => onEdit(item.id)} className="text-xs py-1 px-2 rounded border border-gray-300 bg-white text-gray-500 hover:bg-gray-100">
          수정
        </button>
        <button onClick={() => onDelete(item.id)} className="text-xs py-1 px-2 rounded border border-gray-300 bg-white text-gray-500 hover:bg-red-500 hover:text-white">
          삭제
        </button>
      </div>
      <div className="font-bold w-20 text-primary flex-shrink-0 text-sm">{format12Hour(item.time)}</div>
      <div className="border-l border-gray-200 pl-4 flex-grow">
        <span className={badgeClass}>{item.typeName}</span>
        <span className="font-bold block text-text-main">{item.title}</span>
        {item.location && (
          <div className="flex flex-wrap items-center gap-2 my-1">
            <div className="text-xs text-primary font-medium">📍 {item.location}</div>
            <button 
              onClick={handleNavigation}
              className="text-xs py-1 px-2 bg-[#FEE500] text-black rounded hover:bg-[#FDD835] font-bold border-none cursor-pointer transition-colors shadow-sm flex items-center"
            >
              길안내
            </button>
          </div>
        )}
        {item.sub && <span className="text-sm text-text-sub whitespace-pre-wrap">{item.sub}</span>}
      </div>
    </div>
  );
};

export default TimelineItem;
