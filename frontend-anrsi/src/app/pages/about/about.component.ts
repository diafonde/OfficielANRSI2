import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="about-hero">
      <div class="container">
        <h1>About ScienceNOVA</h1>
        <p>National Agency for Scientific Research and Innovation</p>
      </div>
      <div class="hero-overlay"></div>
    </div>
    
    <div class="container">
      <section class="section mission-section">
        <div class="grid grid-2">
          <div class="mission-content">
            <h2>Our Mission</h2>
            <p class="mission-statement">To advance human knowledge through scientific discovery and foster innovation that addresses the world's most pressing challenges.</p>
            <p>ScienceNOVA was established in 2015 as the national body responsible for coordinating scientific research efforts across multiple disciplines. Our mandate is to support groundbreaking research, foster international scientific collaboration, and ensure that scientific advancements benefit society at large.</p>
            <p>We believe that scientific progress is essential for societal development, economic growth, and addressing global challenges from climate change to public health crises.</p>
          </div>
          <div class="mission-image">
            <img src="https://images.pexels.com/photos/3912976/pexels-photo-3912976.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Scientists in a laboratory" class="img-fluid">
          </div>
        </div>
      </section>
      
      <section class="section values-section">
        <h2 class="section-title">Our Core Values</h2>
        <div class="grid grid-3">
          <div class="value-card">
            <div class="value-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
            </div>
            <h3>Excellence</h3>
            <p>We uphold the highest standards in scientific research, methodologies, and reporting, ensuring that all work conducted under our auspices meets rigorous international benchmarks.</p>
          </div>
          <div class="value-card">
            <div class="value-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                <polyline points="17 6 23 6 23 12"></polyline>
              </svg>
            </div>
            <h3>Innovation</h3>
            <p>We foster an environment where creative thinking and novel approaches are encouraged, supporting researchers in exploring uncharted scientific territories.</p>
          </div>
          <div class="value-card">
            <div class="value-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
            </div>
            <h3>Collaboration</h3>
            <p>We believe that the most significant advances come through collaboration across disciplines, institutions, and national boundaries.</p>
          </div>
          <div class="value-card">
            <div class="value-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </div>
            <h3>Transparency</h3>
            <p>We are committed to open science principles, making research findings, methodologies, and data accessible to the scientific community and the public.</p>
          </div>
          <div class="value-card">
            <div class="value-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <h3>Integrity</h3>
            <p>We maintain the highest ethical standards in all our activities, from research conduct to resource allocation and institutional governance.</p>
          </div>
          <div class="value-card">
            <div class="value-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                <line x1="6" y1="1" x2="6" y2="4"></line>
                <line x1="10" y1="1" x2="10" y2="4"></line>
                <line x1="14" y1="1" x2="14" y2="4"></line>
              </svg>
            </div>
            <h3>Impact</h3>
            <p>We focus on research that addresses real-world challenges and has the potential to create meaningful change in society, the economy, and the environment.</p>
          </div>
        </div>
      </section>
      
      <section class="section leadership-section">
        <h2 class="section-title">Our Leadership</h2>
        <div class="grid grid-3">
          <div class="leadership-card">
            <div class="leadership-image">
              <img src="https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Dr. Eleanor Richards" class="img-fluid">
            </div>
            <div class="leadership-content">
              <h3>Dr. Eleanor Richards</h3>
              <p class="leadership-title">Director General</p>
              <p>Ph.D. in Quantum Physics with over 25 years of experience in scientific leadership and policy development.</p>
            </div>
          </div>
          <div class="leadership-card">
            <div class="leadership-image">
              <img src="https://images.pexels.com/photos/5615665/pexels-photo-5615665.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Dr. Marcus Wong" class="img-fluid">
            </div>
            <div class="leadership-content">
              <h3>Dr. Marcus Wong</h3>
              <p class="leadership-title">Chief Scientific Officer</p>
              <p>Leading researcher in molecular biology with extensive experience coordinating large-scale international research initiatives.</p>
            </div>
          </div>
          <div class="leadership-card">
            <div class="leadership-image">
              <img src="https://images.pexels.com/photos/5327584/pexels-photo-5327584.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Dr. Sophia Patel" class="img-fluid">
            </div>
            <div class="leadership-content">
              <h3>Dr. Sophia Patel</h3>
              <p class="leadership-title">Director of Innovation</p>
              <p>Expert in translating scientific discoveries into practical applications with a background in engineering and entrepreneurship.</p>
            </div>
          </div>
        </div>
      </section>
      
      <section class="section achievements-section">
        <h2 class="section-title">Key Achievements</h2>
        <div class="timeline">
          <div class="timeline-item">
            <div class="timeline-date">2024</div>
            <div class="timeline-content">
              <h3>Quantum Computing Breakthrough</h3>
              <p>Our quantum computing division achieved a significant breakthrough in error correction, bringing practical quantum computing closer to reality.</p>
            </div>
          </div>
          <div class="timeline-item even">
            <div class="timeline-date">2023</div>
            <div class="timeline-content">
              <h3>Climate Modeling Initiative</h3>
              <p>Launched the most comprehensive climate modeling initiative to date, providing high-resolution predictions for policy makers worldwide.</p>
            </div>
          </div>
          <div class="timeline-item">
            <div class="timeline-date">2022</div>
            <div class="timeline-content">
              <h3>International Research Collaboration</h3>
              <p>Established partnerships with 15 leading research institutions across 6 continents, creating the largest global scientific network.</p>
            </div>
          </div>
          <div class="timeline-item even">
            <div class="timeline-date">2020</div>
            <div class="timeline-content">
              <h3>Pandemic Response</h3>
              <p>Coordinated rapid research response to the global pandemic, supporting vaccine development and public health initiatives.</p>
            </div>
          </div>
          <div class="timeline-item">
            <div class="timeline-date">2019</div>
            <div class="timeline-content">
              <h3>Research Funding Expansion</h3>
              <p>Secured $1.2 billion in funding for next-generation scientific initiatives, the largest research investment in our history.</p>
            </div>
          </div>
        </div>
      </section>
      
      <section class="section partnerships-section">
        <h2 class="section-title">Our Partners</h2>
        <p class="section-subtitle">We collaborate with leading institutions around the world to advance scientific discovery.</p>
        <div class="partners-grid">
          <div class="partner-logo">University of Cambridge</div>
          <div class="partner-logo">Max Planck Institute</div>
          <div class="partner-logo">Stanford University</div>
          <div class="partner-logo">Tokyo Institute of Technology</div>
          <div class="partner-logo">National Institute of Health</div>
          <div class="partner-logo">CERN</div>
          <div class="partner-logo">NASA</div>
          <div class="partner-logo">European Space Agency</div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .about-hero {
      position: relative;
      height: 400px;
      background-image: url('https://images.pexels.com/photos/2156881/pexels-photo-2156881.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2');
      background-size: cover;
      background-position: center;
      display: flex;
      align-items: center;
      color: white;
      margin-top: 60px;
    }
    
    .about-hero .container {
      position: relative;
      z-index: 2;
      text-align: center;
    }
    
    .about-hero h1 {
      font-size: clamp(2.5rem, 5vw, 4rem);
      margin-bottom: var(--space-3);
      color: white;
    }
    
    .about-hero p {
      font-size: clamp(1.1rem, 2vw, 1.5rem);
      max-width: 600px;
      margin: 0 auto;
    }
    
    .hero-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(to right, rgba(10, 61, 98, 0.8), rgba(10, 61, 98, 0.6));
      z-index: 1;
    }
    
    .mission-section {
      padding-top: var(--space-16);
    }
    
    .mission-content h2 {
      color: var(--primary-600);
      margin-bottom: var(--space-4);
    }
    
    .mission-statement {
      font-size: var(--text-xl);
      font-weight: 500;
      color: var(--primary-500);
      border-left: 4px solid var(--primary-500);
      padding-left: var(--space-4);
      margin-bottom: var(--space-6);
    }
    
    .mission-image {
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    }
    
    .values-section {
      background-color: var(--neutral-50);
    }
    
    .value-card {
      background-color: white;
      padding: var(--space-6);
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .value-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    }
    
    .value-icon {
      width: 64px;
      height: 64px;
      background-color: var(--primary-50);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: var(--space-4);
      color: var(--primary-500);
    }
    
    .value-card h3 {
      margin-bottom: var(--space-2);
      color: var(--primary-600);
    }
    
    .leadership-card {
      background-color: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .leadership-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    }
    
    .leadership-image {
      height: 300px;
      overflow: hidden;
    }
    
    .leadership-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }
    
    .leadership-card:hover .leadership-image img {
      transform: scale(1.05);
    }
    
    .leadership-content {
      padding: var(--space-4);
    }
    
    .leadership-content h3 {
      margin-bottom: var(--space-1);
      color: var(--neutral-900);
    }
    
    .leadership-title {
      color: var(--primary-500);
      font-weight: 500;
      margin-bottom: var(--space-3);
    }
    
    .partnerships-section {
      background-color: var(--primary-50);
    }
    
    .section-subtitle {
      text-align: center;
      max-width: 700px;
      margin: 0 auto var(--space-8) auto;
      color: var(--neutral-700);
    }
    
    .partners-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--space-4);
    }
    
    @media (min-width: 768px) {
      .partners-grid {
        grid-template-columns: repeat(4, 1fr);
      }
    }
    
    .partner-logo {
      background-color: white;
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      font-weight: 600;
      color: var(--neutral-700);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      transition: all 0.3s ease;
    }
    
    .partner-logo:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
      color: var(--primary-500);
    }
  `]
})
export class AboutComponent {}