import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/Card';
import { useTraining } from '../hooks/useTraining';

const ModuleCard = ({ module }) => {
    const isCompleted = module.progress === 100;
    return (
        <Link to={`/training/${module.id}`}>
            <Card className="flex flex-col h-full transform hover:scale-105 transition-transform duration-300">
                <div className="flex-grow">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-2xl font-bold text-neutral-dark">{module.title}</h3>
                        <div className="text-4xl">{module.badgeIcon}</div>
                    </div>
                    <p className="text-gray-600 mb-4">{module.description}</p>
                </div>
                <div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                        <div 
                            className={`h-2.5 rounded-full ${isCompleted ? 'bg-brand-green' : 'bg-brand-blue'}`} 
                            style={{ width: `${module.progress}%` }}
                        ></div>
                    </div>
                    <p className="text-sm text-right font-semibold text-gray-500">{module.progress}% Complete</p>
                </div>
            </Card>
        </Link>
    );
};

export const TrainingHubPage = () => {
    const { modules } = useTraining();
    
    return (
        <div className="p-6 space-y-8">
            <h1 className="text-4xl font-bold">Training Hub</h1>
            <p className="text-lg text-gray-600">Enhance your skills and get certified to better help the community.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {modules.map(module => (
                    <ModuleCard key={module.id} module={module} />
                ))}
            </div>
        </div>
    );
};
