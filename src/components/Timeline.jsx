import TimelineSection from './TimelineSection';

const Timeline = ({ schedules, onEdit, onDelete, editingSchedule, onSaveEdit, onCancelEdit }) => {
  const dates = [...new Set(schedules.map(s => s.date))].sort();

  return (
    <div id="timeline-container">
      {dates.length > 0 ? (
        dates.map((date, index) => {
          const daySchedules = schedules.filter(s => s.date === date).sort((a, b) => a.time.localeCompare(b.time));
          const dayCount = index + 1;

          return (
            <TimelineSection
              key={date}
              date={date}
              dayCount={dayCount}
              schedules={daySchedules}
              onEdit={onEdit}
              onDelete={onDelete}
              editingSchedule={editingSchedule}
              onSaveEdit={onSaveEdit}
              onCancelEdit={onCancelEdit}
            />
          );
        })
      ) : (
        <div className="text-center text-gray-500 py-10">
          등록된 일정이 없습니다. 일정을 추가해보세요!
        </div>
      )}
    </div>
  );
};

export default Timeline;
