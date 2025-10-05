import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Footer } from '../components/Footer';
import { useLanguage } from '../hooks/useLanguage';

const HowItWorksIcon = ({ icon, title, description }) => (
    <Card className="text-center items-center flex flex-col transform hover:scale-105 transition-transform duration-300">
        <div className="bg-brand-blue text-white rounded-full p-4 mb-4 inline-block">
            {icon}
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
    </Card>
);

export const LandingPage = () => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-neutral-light py-20">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold text-neutral-dark leading-tight mb-4 animate-fade-in animate-tracking-in-expand">
              {t('landingTitle')}
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              {t('landingSubtitle')}
            </p>
            <div className="flex justify-center space-x-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Link to="/signup?role=volunteer">
                <Button variant="primary" className="text-lg">{t('registerVolunteer')}</Button>
              </Link>
              <Link to="/signup?role=user">
                <Button variant="secondary" className="text-lg">{t('requestAssistance')}</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-12">{t('howItWorks')}</h2>
            <div className="grid md:grid-cols-3 gap-8">
                <HowItWorksIcon 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
                    title={t('reportIncidentTitle')}
                    description={t('reportIncidentDesc')}
                />
                <HowItWorksIcon 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 16.382V5.618a1 1 0 00-1.447-.894L15 7m-6 10h6" /></svg>}
                    title={t('findSafetyTitle')}
                    description={t('findSafetyDesc')}
                />
                <HowItWorksIcon 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                    title={t('getHelpTitle')}
                    description={t('getHelpDesc')}
                />
            </div>
          </div>
        </section>
        
        {/* Bot Integration Section */}
        <section className="bg-neutral-medium py-20">
            <div className="container mx-auto px-6">
                <div className="text-center">
                    <h2 className="text-4xl font-bold text-neutral-dark mb-4">{t('noInternetTitle')}</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">{t('noInternetDesc')}</p>
                </div>
                <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 items-center">
                    <div className="bg-white p-8 rounded-xl shadow-lg">
                        <h3 className="text-2xl font-bold mb-4 flex items-center">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="h-8 w-8 mr-3" />
                            {t('whatsapp')}
                        </h3>
                        <p className="text-gray-700">{t('whatsappDesc')}</p>
                        <p className="mt-4 font-mono bg-gray-100 p-3 rounded-md text-center text-lg">9725550146</p>
                    </div>
                     <div className="bg-white p-8 rounded-xl shadow-lg">
                        <h3 className="text-2xl font-bold mb-4 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3 text-brand-blue" viewBox="0 0 20 20" fill="currentColor"><path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 2.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                            {t('sms')}
                        </h3>
                        <p className="text-gray-700">{t('smsDesc')}</p>
                        <p className="mt-4 font-mono bg-gray-100 p-3 rounded-md text-center text-lg">7233428365</p>
                    </div>
                </div>
            </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};
