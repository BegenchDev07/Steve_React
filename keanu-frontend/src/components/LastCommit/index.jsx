import React, { useState, useEffect } from 'react';
import lastInfo  from '/src/utils/lastInfo.json';

export default function LastCommit() {
    const [lastInfoState, setLastInfoState] = useState(null);

    const fetchLastInfo = async () => {
        try {
            setLastInfoState(lastInfo);
        } catch (error) {
            console.error('Error fetching last commit info:', error);
        }
    };

    const formatDataTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString();
    }

    useEffect(() => {
        fetchLastInfo();
    }, []);

    return (
        <div>
            {lastInfoState && (
                <p className="text-xs text-slate-500">
                    {lastInfoState.lastCommitID} : {formatDataTime(lastInfoState.lastTime)}
                </p>
            )}
        </div>

    );
};

