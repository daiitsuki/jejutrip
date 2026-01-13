import { useState, useEffect } from 'react';
import TimelineItem from './TimelineItem';

const TimelineSection = ({ 
  date, 
  dayCount, 
  schedules, 
  onEdit, 
  onDelete, 
  editingSchedule, 
  onSaveEdit, 
  onCancelEdit 
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const storageKey = `jeju_trip_section_open_${date}`;

  useEffect(() => {
    const savedState = localStorage.getItem(storageKey);
    if (savedState !== null) {
      setIsOpen(JSON.parse(savedState));
    }
  }, [storageKey]);

  const toggleOpen = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    localStorage.setItem(storageKey, JSON.stringify(newState));
  };

  const dateObj = new Date(date);
  const dayName = ['일', '월', '화', '수', '목', '금', '토'][dateObj.getDay()];
  const formattedDate = date.replace(/-/g, '.');

  return (
    <section className="mb-6">
      <div 
        onClick={toggleOpen}
        className="flex items-center justify-between cursor-pointer p-3 bg-white rounded-lg shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors mb-4"
      >
        <div className="text-lg font-bold border-l-4 border-primary pl-2.5 text-gray-800">
          {dayCount}일차 | {formattedDate} ({dayName})
        </div>
        <div className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      
      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        {schedules.map(item => (
          <TimelineItem
            key={item.id}
            item={item}
            onEdit={onEdit}
            onDelete={onDelete}
            isEditing={editingSchedule?.id === item.id}
            editingSchedule={editingSchedule}
            onSaveEdit={onSaveEdit}
            onCancelEdit={onCancelEdit}
          />
        ))}
        {schedules.length === 0 && (
          <div className="text-center text-gray-400 py-8 bg-gray-50 rounded-lg text-sm">
            등록된 일정이 없습니다.
          </div>
        )}
      </div>
    </section>
  );
};

export default TimelineSection;
