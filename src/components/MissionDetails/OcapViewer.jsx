import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../../api";

const OcapViewer = ({ missionId }) => {
  const [missionName, setMissionName] = useState("");
  const [ocapLink, setOcapLink] = useState("");
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchMissionInfo = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/mission-name/${missionId}`
        );
        const data = res.data?.mission_name;
        if (data) {
          setMissionName(data.mission_name || `Миссия #${missionId}`);
          setOcapLink(data.ocap_link);
        }
      } catch (err) {
        console.error("Ошибка при загрузке mission_name:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMissionInfo();
  }, [missionId]);

  if (loading) return <div className="mb-4">Загрузка миссии...</div>;

  return (
    <div className="mb-8">
      <div
        className="cursor-pointer bg-blue-600 hover:bg-blue-700 border border-blue-700 rounded-lg px-4 py-2 mb-4 max-w-max mx-auto transition-all duration-200 text-base text-white text-center shadow"
        onClick={() => setIsOpen(!isOpen)}
      >
        📽️ Открыть OCAP ({missionName})
      </div>

      {isOpen && ocapLink && (
        <div className="overflow-hidden transition-all duration-300">
          <div className="relative w-full aspect-video rounded-lg shadow-lg border border-zinc-700">
            <iframe
              src={ocapLink}
              title="OCAP Viewer"
              className="absolute top-0 left-0 w-full h-full border-none"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default OcapViewer;
