import Contact from '@/pagess/Contact/Contact';
import React from 'react';

export const metadata = {
  title: "Contact — QuestPodAI Academic Intelligence Platform",
  description:
    "Get in touch with QuestPodAI. Request an institution demo, ask about student plans, or reach out to our team. We respond within 24 hours.",
};

function contactPage() {
  return (
    <div><Contact /></div>
  );
}

export default contactPage;