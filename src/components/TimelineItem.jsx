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
            <a 
              href={`https://map.kakao.com/link/search/${encodeURIComponent(item.location)}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs py-1 px-2 bg-[#FEE500] text-black rounded hover:bg-[#FDD835] font-bold no-underline transition-colors shadow-sm flex items-center"
            >
              길안내
            </a>
          </div>
        )}
        {item.sub && <span className="text-sm text-text-sub whitespace-pre-wrap">{item.sub}</span>}
      </div>
    </div>
  );
};

export default TimelineItem;
