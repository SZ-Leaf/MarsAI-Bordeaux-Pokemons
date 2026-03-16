import { useState } from "react";
import { SubmissionsList, VideoDetails } from "../../submission";
import { useAdminReportedSubmissions } from "../../../../hooks/useAdminReportedSubmissions";

const AdminReports = ({ onDetailToggle }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [pagination, setPagination] = useState({
    limit: 15,
    offset: 0,
  });

  const {
    submissions,
    total,
    loading,
  } = useAdminReportedSubmissions({
    limit: pagination.limit,
    offset: pagination.offset,
    enabled: true,
  });

  if (activeIndex !== null) {
    return (
      <VideoDetails
        video={submissions[activeIndex]}
        onClose={() => setActiveIndex(null)}
        onPrev={() => setActiveIndex((i) => i - 1)}
        onNext={() => setActiveIndex((i) => i + 1)}
        hasPrev={activeIndex > 0}
        hasNext={activeIndex < submissions.length - 1}
      />
    );
  }

  return (
    <section className="submissions-section pt-4">
      <div className="rounded-xl border border-red-900/40 bg-[#111] p-4 mb-6">
        <h2 className="text-white text-2xl font-semibold">
          Vidéos signalées
        </h2>
        <p className="mt-1 text-sm text-gray-400">
          Toutes les vidéos signalées par les utilisateurs.
        </p>
      </div>

      <SubmissionsList
        submissions={submissions}
        paginationFilters={pagination}
        total={total}
        loading={loading}
        showReportCount={true}
        onPageChange={(newOffset) => {
          setPagination((prev) => ({ ...prev, offset: newOffset }));
        }}
        onVideoClick={(index) => setActiveIndex(index)}
      />
    </section>
  );
};

export default AdminReports;