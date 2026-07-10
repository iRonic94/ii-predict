import { useEffect, useState } from 'react';

import MainLayout from '../../components/layout/MainLayout/MainLayout';
import EpisodeSelector from '../../components/vote/EpisodeSelector/EpisodeSelector';
import EpisodeSchedule from '../../components/admin/EpisodeSchedule/EpisodeSchedule';
import EpisodeResults from '../../components/admin/EpisodeResults/EpisodeResults';

import { getConcurentiActivi } from '../../services/concurentiService';
import { getAllEpisodes } from '../../services/episodeService';

import './Admin.scss';

function Admin() {

    const [episodes, setEpisodes] = useState([]);
    const [selectedEpisode, setSelectedEpisode] = useState(null);

    const [concurenti, setConcurenti] = useState([]);

    useEffect(() => {

        loadEpisodes();
        loadConcurenti();

    }, []);

    const loadEpisodes = async () => {

        const { data, error } = await getAllEpisodes();

        if (error) {
            console.error(error);
            return;
        }

        setEpisodes(data);

        if (!selectedEpisode && data.length > 0) {
            setSelectedEpisode(data[0]);
        }

    };

    const loadConcurenti = async () => {

        const { data, error } = await getConcurentiActivi();

        if (error) {
            console.error(error);
            return;
        }

        setConcurenti(data);

    };

    return (

        <MainLayout>

            <div className="admin-page">

                <h1>Admin Panel</h1>

                <EpisodeSelector
                    episodes={episodes}
                    selectedEpisode={selectedEpisode}
                    selectable
                    onSelect={setSelectedEpisode}
                />

                {selectedEpisode && (

                    <>
                        <EpisodeSchedule
                            episode={selectedEpisode}
                            onUpdated={loadEpisodes}
                        />

                        <EpisodeResults
                            episode={selectedEpisode}
                            concurenti={concurenti}
                            onValidated={loadEpisodes}
                        />
                    </>

                )}

            </div>

        </MainLayout>

    );

}

export default Admin;