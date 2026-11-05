// Keep the public domain consistent with Google Business Profile and Search Console.
export const siteUrl = 'https://pinnacleachieversacademy.com/';
export const siteTitle = '+2 Science Coaching in Soro, Balasore | Pinnacle Achievers Academy';
export const siteDescription = 'Explore +2 Science coaching in Soro, Balasore at Pinnacle Achievers Academy. Enquire about CHSE, NEET and JEE preparation. Call +91 86588 16657.';
export const localFaqs = [
  ['Where can I find +2 Science coaching in Soro?', 'Pinnacle Achievers Academy is on Lingapada Road, near U.N. College Field and opposite Khemeswar Temple, Soro, Balasore, Odisha 756045. Call +91 86588 16657 to enquire about +2 Science coaching and visit the academy.'],
  ['How do I choose the best +2 Science coaching centre in Soro or Balasore?', 'Compare the teaching approach, subject coverage, regular assessments, doubt support and travel arrangements. Visit the academy, meet the team and ask about the confirmed timetable, fees and programme availability before choosing a coaching centre.'],
  ['Can students from nearby areas enquire about coaching in Soro?', 'Yes. Students and parents from Soro and the wider Balasore district are welcome to enquire. If you live around 50–60 km away, speak with our team about class timings and any available residential arrangements before planning your journey.'],
];

export const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['EducationalOrganization', 'LocalBusiness'],
      '@id': `${siteUrl}#academy`,
      name: 'Pinnacle Achievers Academy',
      url: siteUrl,
      description: siteDescription,
      image: `${siteUrl}office.jpeg`,
      logo: `${siteUrl}pinnacle-logo.png`,
      telephone: '+918658816657',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Near U.N. College Field, Opposite Khemeswar Temple, Lingapada Road',
        addressLocality: 'Soro',
        addressRegion: 'Odisha',
        postalCode: '756045',
        addressCountry: 'IN',
      },
      areaServed: [
        { '@type': 'City', name: 'Soro' },
        { '@type': 'AdministrativeArea', name: 'Balasore district, Odisha' },
      ],
      hasMap: 'https://maps.app.goo.gl/P5GZzTXo3Jetc4Sj7',
      knowsAbout: ['+2 Science coaching', 'CHSE +2 Science', 'NEET preparation', 'JEE Main and Advanced preparation'],
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}#website`,
      url: siteUrl,
      name: 'Pinnacle Achievers Academy',
      publisher: { '@id': `${siteUrl}#academy` },
      inLanguage: 'en-IN',
    },
    {
      '@type': 'WebPage',
      '@id': `${siteUrl}#webpage`,
      url: siteUrl,
      name: siteTitle,
      description: siteDescription,
      isPartOf: { '@id': `${siteUrl}#website` },
      about: { '@id': `${siteUrl}#academy` },
      inLanguage: 'en-IN',
    },
  ],
};
