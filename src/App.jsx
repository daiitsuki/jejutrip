import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { loadKakaoSdk } from './utils/kakaoLoader';
import Header from './components/Header';
import ScheduleForm from './components/ScheduleForm';
import Timeline from './components/Timeline';

function App() {
  const [schedules, setSchedules] = useState([]);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    // Load Kakao SDK
    loadKakaoSdk().catch(err => console.error('Kakao SDK Load Error:', err));

    let channel = null;

    const initializeData = async () => {
      await fetchSchedules();
      
      channel = supabase
        .channel('realtime_schedules')
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "schedules" },
          (payload) => {
            if (payload.eventType === "INSERT") {
              setSchedules((prev) => {
                // Prevent duplicates if fetchSchedules already got it
                if (prev.find(item => item.id === payload.new.id)) return prev;
                return [...prev, payload.new];
              });
            } else if (payload.eventType === "UPDATE") {
              setSchedules((prev) =>
                prev.map((item) =>
                  item.id === payload.new.id ? payload.new : item
                )
              );
            } else if (payload.eventType === "DELETE") {
              setSchedules((prev) =>
                prev.filter((item) => item.id !== payload.old.id)
              );
            }
          }
        )
        .subscribe();
    };

    initializeData();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  const fetchSchedules = async () => {
    const { data, error } = await supabase
      .from("schedules")
      .select("*")
      .order("date", { ascending: true })
      .order("time", { ascending: true });

    if (error) {
      console.error("Error fetching schedules:", error);
      alert("일정을 불러오는데 실패했습니다.");
    } else {
      setSchedules(data);
    }
  };

  const handleSaveSchedule = async (schedule) => {
    if (editingSchedule) {
      const { error } = await supabase
        .from("schedules")
        .update(schedule)
        .eq("id", editingSchedule.id);

      if (error) {
        console.error("Error updating schedule:", error);
        alert("일정 수정 중 오류가 발생했습니다.");
        return;
      }
      setEditingSchedule(null);
    } else {
      const { id, ...newSchedule } = schedule;
      const { error } = await supabase.from("schedules").insert([newSchedule]);

      if (error) {
        console.error("Error inserting schedule:", error);
        alert("일정 추가 중 오류가 발생했습니다.");
        return;
      }
      setIsAdding(false);
    }
  };

  const handleEditSchedule = (id) => {
    const scheduleToEdit = schedules.find((s) => s.id === id);
    setEditingSchedule(scheduleToEdit);
    setIsAdding(false);
  };

  const handleDeleteSchedule = async (id) => {
    if (window.confirm("이 일정을 삭제하시겠습니까?")) {
      const { error } = await supabase.from("schedules").delete().eq("id", id);

      if (error) {
        console.error("Error deleting schedule:", error);
        alert("일정 삭제 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className="bg-bg-color text-text-main font-sans leading-relaxed p-5 pb-24 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <Header />

        <div className="mb-6">
          {!isAdding && !editingSchedule && (
            <button
              onClick={() => setIsAdding(true)}
              className="w-full p-4 bg-primary text-white rounded-xl font-bold shadow-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              <span className="text-xl">+</span> 일정 추가하기
            </button>
          )}

          <div
            className={`transition-all duration-500 ease-in-out overflow-hidden ${
              isAdding
                ? "max-h-[800px] opacity-100 translate-y-0"
                : "max-h-0 opacity-0 -translate-y-4"
            }`}
          >
            <ScheduleForm
              onSave={handleSaveSchedule}
              onCancel={() => setIsAdding(false)}
            />
          </div>
        </div>

        <Timeline
          schedules={schedules}
          onEdit={handleEditSchedule}
          onDelete={handleDeleteSchedule}
          editingSchedule={editingSchedule}
          onSaveEdit={handleSaveSchedule}
          onCancelEdit={() => setEditingSchedule(null)}
        />
      </div>
    </div>
  );
}

export default App;
