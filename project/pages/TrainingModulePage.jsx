import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useTraining } from '../hooks/useTraining';

export const TrainingModulePage = () => {
    const { moduleId } = useParams();
    const navigate = useNavigate();
    const { modules, updateModuleProgress } = useTraining();
    const module = modules.find(m => m.id === moduleId);

    if (!module) {
        return (
            <div className="p-6 text-center">
                <h1 className="text-2xl font-bold">Training Module Not Found</h1>
                <Link to="/training"><Button className="mt-4">Back to Training Hub</Button></Link>
            </div>
        );
    }
    
    const handleQuizSubmit = (e) => {
        e.preventDefault();
        if (moduleId) {
            updateModuleProgress(moduleId, 100);
        }
        alert(`Quiz for "${module.title}" submitted! Your certification has been updated.`);
        navigate('/training');
    }

    return (
        <div className="p-6 space-y-8">
            <div className="flex items-center">
                <Link to="/training" className="text-brand-blue hover:underline mr-4">
                    &larr; Back to Training Hub
                </Link>
            </div>
            <h1 className="text-4xl font-bold">{module.badgeIcon} {module.title}</h1>
            
            <Card>
                <h2 className="text-2xl font-bold mb-4">Module Content</h2>
                <div className="prose max-w-none">
                    <p>{module.description}</p>
                    <p> 
                        This is placeholder content for the training module. In a real application, this area would be filled with detailed instructions, images, and videos relevant to the topic. For example, a First Aid module would explain how to perform CPR, treat wounds, and recognize symptoms of shock.
                    </p>
                    <h3>Key Learning Objectives:</h3>
                    <ul>
                        <li>Understand the core principles of {module.title}.</li>
                        <li>Learn to identify critical situations requiring intervention.</li>
                        <li>Master the basic techniques and protocols.</li>
                        <li>Know when to escalate and call for professional help.</li>
                    </ul>
                </div>
            </Card>

            <Card>
                <h2 className="text-2xl font-bold mb-4">Knowledge Check Quiz</h2>
                <form className="space-y-6" onSubmit={handleQuizSubmit}>
                    <div>
                        <p className="font-semibold mb-2">1. What is the first step in any emergency situation?</p>
                        <div className="space-y-2">
                            <label className="flex items-center"><input type="radio" name="q1" className="mr-2" required/> Assess the situation for safety.</label>
                            <label className="flex items-center"><input type="radio" name="q1" className="mr-2" /> Immediately start providing aid.</label>
                            <label className="flex items-center"><input type="radio" name="q1" className="mr-2" /> Call the person's family.</label>
                        </div>
                    </div>
                     <div>
                        <p className="font-semibold mb-2">2. Which of the following is NOT a primary goal of {module.title}?</p>
                        <div className="space-y-2">
                            <label className="flex items-center"><input type="radio" name="q2" className="mr-2" required/> Preserve life.</label>
                            <label className="flex items-center"><input type="radio" name="q2" className="mr-2" /> Prevent further harm.</label>
                            <label className="flex items-center"><input type="radio" name="q2" className="mr-2" /> Provide a definitive medical diagnosis.</label>
                        </div>
                    </div>
                    <Button type="submit" className="w-full">Submit Quiz & Mark as Complete</Button>
                </form>
            </Card>
        </div>
    );
};
