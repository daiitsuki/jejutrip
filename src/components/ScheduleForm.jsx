import { useState, useEffect } from 'react';

const ScheduleForm = ({ onSave, editingSchedule, onCancel }) => {
  const [schedule, setSchedule] = useState({
    date: '2026-01-17',
    time: '',
    type: 'badge-flight',
    typeName: '항공',
    title: '',
    location: '',
    sub: ''
  });

  useEffect(() => {
    if (editingSchedule) {
      setSchedule(editingSchedule);
    }
  }, [editingSchedule]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setSchedule(prev => ({ ...prev, [id]: value }));
  };

  const handleTypeChange = (e) => {
    const type = e.target.value;
    const typeName = e.target.options[e.target.selectedIndex].text;
    setSchedule(prev => ({ ...prev, type, typeName }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!schedule.time || !schedule.title) {
      alert('시간과 제목을 입력해주세요!');
      return;
    }
    onSave(schedule);
    if (!editingSchedule) {
      resetForm();
    }
  };

  const handleCancel = () => {
    onCancel();
    if (!editingSchedule) {
      setTimeout(() => resetForm(), 300); // Wait for animation to finish
    }
  };

  const resetForm = () => {
    setSchedule({
      date: '2026-01-17',
      time: '',
      type: 'badge-flight',
      typeName: '항공',
      title: '',
      location: '',
      sub: ''
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-5 rounded-xl mb-4 shadow-lg border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-700">{editingSchedule ? '일정 수정' : '새 일정 추가'}</h3>
        <button 
          type="button" 
          onClick={handleCancel}
          className="text-gray-400 hover:text-gray-600 text-sm"
        >
          취소
        </button>
      </div>
      <select id="date" value={schedule.date} onChange={handleChange} className="w-full p-2.5 mb-2.5 border border-gray-300 rounded-lg box-border text-sm">
        <option value="2026-01-17">1월 17일 (토)</option>
        <option value="2026-01-18">1월 18일 (일)</option>
        <option value="2026-01-19">1월 19일 (월)</option>
        <option value="2026-01-20">1월 20일 (화)</option>
      </select>
      <div className="flex gap-2.5">
        <input type="time" id="time" value={schedule.time} onChange={handleChange} className="w-1/3 p-2.5 mb-2.5 border border-gray-300 rounded-lg box-border text-sm" />
        <select id="type" value={schedule.type} onChange={handleTypeChange} className="w-2/3 p-2.5 mb-2.5 border border-gray-300 rounded-lg box-border text-sm">
          <option value="badge-flight">항공</option>
          <option value="badge-hotel">숙박</option>
          <option value="badge-car">렌터카</option>
          <option value="badge-food">식당</option>
          <option value="badge-cafe">카페</option>
          <option value="badge-normal">일반</option>
        </select>
      </div>
      <input type="text" id="title" placeholder="일정 제목" value={schedule.title} onChange={handleChange} className="w-full p-2.5 mb-2.5 border border-gray-300 rounded-lg box-border text-sm" />
      <input type="text" id="location" placeholder="장소 (예: 제주공항, 연돈)" value={schedule.location} onChange={handleChange} className="w-full p-2.5 mb-2.5 border border-gray-300 rounded-lg box-border text-sm" />
      <textarea id="sub" rows="2" placeholder="상세 내용" value={schedule.sub} onChange={handleChange} className="w-full p-2.5 mb-2.5 border border-gray-300 rounded-lg box-border text-sm"></textarea>
      <div className="flex gap-2">
        <button type="submit" className="flex-grow p-3 bg-primary text-white border-none rounded-lg font-bold cursor-pointer">
          {editingSchedule ? '수정 완료' : '추가하기'}
        </button>
      </div>
    </form>
  );
};

export default ScheduleForm;
