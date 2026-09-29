import React from 'react';
import HistoryTable from '../components/HistoryTable';

export default function HistoryPage({ sessions, onRecordManualEntry, onRecordManualExit }) {
  return (
    <div>
      <HistoryTable 
        sessions={sessions} 
        onRecordManualEntry={onRecordManualEntry} 
        onRecordManualExit={onRecordManualExit} 
      />
    </div>
  );
}
