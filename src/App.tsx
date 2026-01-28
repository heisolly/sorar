import React, { useRef, useLayoutEffect, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import {
  ArrowRight,
  Download,
  PlayCircle,
  Sparkles,
  Activity,
  Mic,
  Zap,
  BarChart2,

  Heart,
  Crown,
  Briefcase,
  Users,
  Twitter,
  Instagram
} from 'lucide-react';
import { supabase } from './lib/supabase';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

import { AdminDashboard } from './Admin';

// ... (existing imports)

function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAdmin, setIsAdmin] = useState(window.location.pathname === '/admin');

  // ... (existing state)

  useEffect(() => {
    // Check path on mount and popstate (browser back/forward)
    const checkPath = () => setIsAdmin(window.location.pathname === '/admin');
    window.addEventListener('popstate', checkPath);
    return () => window.removeEventListener('popstate', checkPath);
  }, []);

  if (isAdmin) {
    return <AdminDashboard />;
  }

  // Header Mapping...
  const [navTheme, setNavTheme] = useState<'light' | 'dark'>('dark');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Record Visit
    const recordVisit = async () => {
      try {
        await supabase.from('site_visits').insert({
          user_agent: navigator.userAgent,
          referrer: document.referrer,
          path: window.location.pathname
        });
      } catch(e) {
        console.error("Visit tracking error", e);
      }
    };
    recordVisit();
  }, []);

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      const { error } = await supabase.from('waitlist').insert({ email });
      if (error) throw error;
      setSubmitted(true);
      setEmail('');
    } catch (err) {
      console.error('Error submitting waitlist:', err);
      alert('Something went wrong. Please try again.');
    }
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // ... existing Hero/Marquee/ZigZag/Horizontal logic ...


      const tl = gsap.timeline({
        scrollTrigger: { trigger: "#flying-container", start: "top 20%", end: "bottom top", scrub: 1 }
      });
      tl.to(".hero-phone", { y: -100, scale: 1.05, duration: 1 }, 0);
      tl.to(".flying-card-1", { x: -200, y: -150, rotation: -10, opacity: 0, duration: 1 }, 0); 
      tl.to(".flying-card-2", { x: 200, y: -200, rotation: 10, opacity: 0, duration: 1 }, 0);
      tl.to(".flying-card-3", { x: -200, y: 100, rotation: -5, opacity: 0, duration: 1 }, 0); 


      const revealSpans = document.querySelectorAll('#revealText span');
      if (revealSpans.length > 0) {
        ScrollTrigger.create({
          trigger: "#method",
          start: "top 60%",
          end: "bottom 60%",
          onEnter: () => {
            revealSpans.forEach((span, i) => {
              setTimeout(() => { span.classList.remove('opacity-20'); span.classList.add('opacity-100'); }, i * 150);
            });
          },
          onLeaveBack: () => {
            revealSpans.forEach((span) => { span.classList.add('opacity-20'); span.classList.remove('opacity-100'); });
          }
        });
      }

      // Feature Phones (Zig Zag)
      gsap.to(".feature-phone-1", { scrollTrigger: { trigger: ".feature-phone-1", start: "top bottom", end: "bottom top", scrub: 1 }, rotateY: -25, rotateX: 10, y: -50 });
      gsap.to(".feature-phone-2", { scrollTrigger: { trigger: ".feature-phone-2", start: "top bottom", end: "bottom top", scrub: 1 }, rotateY: 25, rotateX: 10, y: -50 });


      const track = document.querySelector(".horizontal-track") as HTMLElement;
      const section = document.querySelector(".horizontal-section") as HTMLElement;
      if (track && section) {
          const panels = gsap.utils.toArray(".panel");
          // Force width to ensure horizontal layout exists before pinning
          const totalPanels = panels.length;
          
          // Main Pinned Horizontal Scroll
          const scrollTween = gsap.to(track, {
              x: () => -1 * (window.innerWidth * (totalPanels - 1)), // Move strictly by viewport widths
              ease: "none",
              scrollTrigger: {
                  trigger: section,
                  start: "top top",
                  end: () => "+=" + (window.innerWidth * (totalPanels - 1)), // Scroll duration = movement distance
                  scrub: 1,
                  pin: true,
                  invalidateOnRefresh: true,
                  anticipatePin: 1
              }
          });

          // Text Animations for Horizontal Cards
          panels.forEach((panel: any, i) => {
              if (i === 0) return; // Skip intro panel
              const content = panel.querySelectorAll("h3, p, .order-1, .order-2"); // Select key content
              
              // Only apply if content exists
              if(content.length > 0) {
                  gsap.from(content, {
                     y: 30, // Subtle fly up
                     opacity: 0,
                     duration: 1,
                     stagger: 0.05,
                     ease: "power2.out",
                     scrollTrigger: {
                         trigger: panel,
                         containerAnimation: scrollTween, // Link to horizontal scroll
                         start: "left center", // When left side of panel hits center of screen
                         toggleActions: "play reverse play reverse" 
                     }
                  });
              }
          });
      }




      const featureBlocks = gsap.utils.toArray('.feature-block');
      featureBlocks.forEach((block: any, i) => {
         const isEven = i % 2 === 0;
         const text = block.querySelector('.feature-text');
         const media = block.querySelector('.feature-media');
         if(text && media) {
             gsap.from(text, { scrollTrigger: { trigger: block, start: "top 80%", end: "bottom 80%", toggleActions: "play none none reverse" }, x: isEven ? -50 : 50, opacity: 0, duration: 1, ease: "power3.out" });
             gsap.from(media, { scrollTrigger: { trigger: block, start: "top 80%", end: "bottom 80%", toggleActions: "play none none reverse" }, x: isEven ? 50 : -50, opacity: 0, duration: 1, ease: "power3.out", delay: 0.2 });
         }
      });







      const stackCards = gsap.utils.toArray(".stack-card") as HTMLElement[];
      
      gsap.set(stackCards, { zIndex: (i) => 10 + i, transformOrigin: "center bottom" });

      const stackTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: ".stack-section",
            start: "top top",
            end: "+=200%",
            scrub: 1,
            pin: true,
            anticipatePin: 1,
          }
      });

      stackTimeline.fromTo(stackCards, 
          { 
            yPercent: 150, 
            opacity: 0,
            scale: 0.8,
            rotation: (i) => i % 2 === 0 ? -10 : 10,
          },
          { 
            yPercent: 0, // Fly up to the stack position
            scale: 1, 
            rotation: 0, 
            opacity: 1, 
            duration: 1,
            stagger: 0.5,
            ease: "power2.out"
          }
      );


      const stackContainer = document.getElementById('scenarios-container');
      if (stackContainer) {
          stackContainer.addEventListener('mouseenter', () => {
              stackCards.forEach((card, i) => {
                  // Spread logic:
                  // i=0 (Left): -70% X, -5deg Rotation
                  // i=1 (Center): 0% X, 0deg Rotation
                  // i=2 (Right): +70% X, +5deg Rotation
                  
                  const spreadFactor = (i - 1); // -1, 0, 1

                  gsap.to(card, {
                      xPercent: spreadFactor * 75, // Move sideways significantly
                      rotation: spreadFactor * 5,  // Slight rotation
                      y: Math.abs(spreadFactor) * 20, // Sides drop down slightly to form an arc
                      scale: 1, // Keep scale consistent or slight bump
                      duration: 0.5,
                      ease: "back.out(1.2)", // Bouncy elastic spread
                      overwrite: 'auto'
                  });
              });
          });

          stackContainer.addEventListener('mouseleave', () => {
             stackCards.forEach((card) => {
                // Return to neat stack
                gsap.to(card, {
                    xPercent: 0,
                    rotation: 0,
                    y: 0,
                    scale: 1,
                    duration: 0.4,
                    ease: "power3.out",
                    overwrite: 'auto'
                });
            });
          });
      }


      ScrollTrigger.create({
          trigger: "#dark-aura-section",
          start: "top 50px",
          end: "bottom 50px",
          onEnter: () => setNavTheme('light'),
          onLeave: () => setNavTheme('dark'),
          onEnterBack: () => setNavTheme('light'),
          onLeaveBack: () => setNavTheme('dark')
      });
      // Footer ? (Currently footer is orange/peach, so maybe dark text is better? Footer text is stone-900, so nav should probably be dark too. Let's keep footer as default 'dark' theme nav.)

    }, containerRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    // Lenis Smooth Scroll with Water/Skew Effect
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
    } as any);

    lenis.on('scroll', (e: any) => {
        // Water Effect: Skew content based on velocity
        const skew = Math.min(Math.max(e.velocity * 0.15, -3), 3); // Max 3deg skew
        document.documentElement.style.setProperty('--scroll-skew', `${skew}deg`);
    });

    function raf(time: number) {
        lenis.raf(time)
        requestAnimationFrame(raf)
    }
    
    requestAnimationFrame(raf);

    // Navbar Scroll Effect
    const nav = document.getElementById('navbar');
    const handleScroll = () => {
        if (window.scrollY > 50) {
            nav?.classList.add('py-2');
            nav?.classList.remove('py-4');
        } else {
            nav?.classList.add('py-4');
            nav?.classList.remove('py-2');
        }
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
        lenis.destroy();
        window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <div ref={containerRef} className="bg-[#FDFCFB] text-stone-900 antialiased selection:bg-peach selection:text-stone-900 overflow-x-hidden font-sans">
      
      {/* Navigation - Dynamic Theme */}
      <nav className={`fixed top-0 z-50 w-full transition-all duration-300 py-4 ${navTheme === 'light' ? 'text-white' : 'text-stone-900'}`} id="navbar">
          <div className="absolute inset-0 bg-transparent transition-colors duration-300">
             {/* Optional: Add background blur or color based on theme if needed, currently kept transparent-ish */}
             {navTheme === 'dark' && <div className="absolute inset-0 bg-[#FDFCFB]/80 backdrop-blur-md border-b border-stone-100/50"></div>}
             {navTheme === 'light' && <div className="absolute inset-0 bg-black/10 backdrop-blur-md border-b border-white/10"></div>}
          </div>
          <div className="max-w-7xl mx-auto px-6 relative flex items-center justify-between">
              <div className="flex items-center gap-2 group cursor-pointer">
                   {navTheme === 'dark' ? (
                       <img src="/icon.png" alt="Sorar AI" className="h-12 w-12 transition-transform group-hover:scale-105 duration-500" /> 
                   ) : (
                       <img src="/icon.png" alt="Sorar AI" className="h-12 w-12 transition-transform group-hover:scale-105 duration-500 brightness-0 invert" />
                   )}
                  <span className="text-lg font-medium tracking-tight font-serif ml-1">Sorar</span>
              </div>
              
              <div className={`hidden md:flex items-center gap-8 text-xs font-medium uppercase tracking-widest ${navTheme === 'light' ? 'text-white/80 hover:text-white' : 'text-stone-500 hover:text-black'} transition-colors`}>
                  <a href="#features" className="transition-colors">Features</a>
                  <a href="#scenarios" className="transition-colors">Scenarios</a>
              </div>

              <div className="flex items-center gap-4">
                  <a href="#waitlist" className={`${navTheme === 'light' ? 'bg-white text-black hover:bg-peach' : 'bg-stone-900 text-white hover:bg-stone-800'} text-xs font-semibold uppercase tracking-wider px-5 py-3 rounded-full transition-all hover:scale-105 flex items-center gap-2 shadow-lg`}>
                      <span>Waitlist</span>
                      <ArrowRight className="w-4 h-4" />
                  </a>
              </div>
          </div>
      </nav>

      <main className="w-full relative z-10">
          
          {/* Hero Section */}
          <div className="relative w-full min-h-[110vh] flex flex-col pt-32 pb-12 overflow-hidden bg-[#FDFCFB]">
              {/* Parallax blobs */}
               <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                  <div className="parallax-bg absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-peach/30 rounded-full blur-[120px]"></div>
                  <div className="parallax-bg absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-stone-200/40 rounded-full blur-[100px]"></div>
              </div>

              <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center text-center mt-12">
                  <h1 className="text-6xl md:text-9xl font-medium tracking-tight leading-[0.9] text-stone-900 mb-8 max-w-5xl hero-title">
                      Don't let anxiety<br />
                      <span className="font-serif italic text-stone-400 pr-4">silence</span> your voice.
                  </h1>

                  <p className="text-lg md:text-xl font-normal text-stone-600 mb-10 max-w-xl leading-relaxed text-balance">
                      The first AI social coach that whispers the right words in real-time. Navigate dates, interviews, and conflict with effortless aura.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                      <button className="bg-peach text-stone-900 text-sm font-semibold uppercase tracking-wider px-8 py-4 rounded-full hover:bg-[#f5d0c0] transition-transform hover:scale-105 flex items-center gap-2 shadow-xl shadow-orange-900/5">
                          <Download className="w-4 h-4" />
                          Get the App
                      </button>
                      <button className="bg-white text-stone-900 border border-stone-200 text-sm font-semibold uppercase tracking-wider px-8 py-4 rounded-full hover:bg-stone-50 transition-colors flex items-center gap-2 shadow-sm">
                          <PlayCircle className="w-4 h-4" />
                          See it in action
                      </button>
                  </div>
              </div>

              {/* Flying UI Elements Container */}
              <div className="relative w-full h-[60vh] mt-20 perspective-1000">
                  <div className="max-w-7xl mx-auto h-full relative" id="flying-container">
                      
                      {/* Center Phone */}
                      <div className="absolute left-1/2 top-10 -translate-x-1/2 w-[300px] h-[600px] bg-white rounded-[3rem] border-[8px] border-stone-900 shadow-2xl z-20 hero-phone overflow-hidden transform rotate-x-12 translate-y-10">
                          <div className="bg-stone-50 w-full h-full flex flex-col relative">
                              {/* Dynamic Island */}
                              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-7 bg-black rounded-full z-30 flex items-center justify-center gap-1.5">
                                  <div className="w-1 h-1 bg-peach rounded-full animate-pulse"></div>
                                  <span className="text-[8px] text-white/60 font-medium tracking-wider">LIVE COACH</span>
                              </div>
                              
                              {/* Screen Content */}
                              <div className="flex-1 flex flex-col items-center justify-center pt-12 px-4 space-y-4">
                                  <div className="w-20 h-20 rounded-full bg-stone-200 overflow-hidden mb-4 border-2 border-white shadow-md">
                                      <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200" className="w-full h-full object-cover opacity-80" alt="Caller" />
                                  </div>
                                  
                                  <div className="w-full bg-white p-4 rounded-2xl rounded-tr-none shadow-sm border border-stone-100 transform scale-95 origin-left">
                                      <p className="text-xs text-stone-400 mb-1">Date</p>
                                      <p className="text-sm font-medium">"So, what drives you lately?"</p>
                                  </div>

                                  <div className="flex flex-col items-center gap-1 animate-pulse">
                                      <div className="h-8 w-[1px] bg-stone-300"></div>
                                      <div className="bg-stone-900 text-white px-4 py-2 rounded-full text-xs font-medium shadow-lg">
                                          Use a story bridge...
                                      </div>
                                  </div>

                                  <div className="w-full bg-peach/20 p-4 rounded-2xl rounded-tl-none border border-peach/50 shadow-sm">
                                      <div className="flex items-center gap-2 mb-1">
                                          <Sparkles className="w-3 h-3 text-orange-600" />
                                          <p className="text-xs text-orange-600 font-semibold uppercase">Suggestion</p>
                                      </div>
                                      <p className="text-sm text-stone-800 leading-snug">"Actually, I've been really obsessed with [Hobby]. It reminds me of when..."</p>
                                  </div>
                              </div>
                          </div>
                      </div>

                      {/* Flying Cards (Will disperse on scroll) */}
                      {/* Left Card 1 */}
                      <div className="flying-card-1 absolute top-20 left-[10%] w-64 bg-white p-4 rounded-2xl shadow-xl border border-stone-100 z-10 hidden md:block">
                          <div className="flex items-center gap-3 mb-2">
                              <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                                  <Activity className="w-4 h-4" />
                              </div>
                              <span className="text-xs font-semibold uppercase text-stone-500">Heart Rate</span>
                          </div>
                          <div className="text-2xl font-serif font-medium text-stone-900">112 bpm</div>
                          <p className="text-xs text-red-400 mt-1">High stress detected</p>
                      </div>

                      {/* Right Card 1 */}
                      <div className="flying-card-2 absolute top-32 right-[10%] w-64 bg-stone-900 p-4 rounded-2xl shadow-xl border border-stone-800 z-10 hidden md:block">
                          <div className="flex items-center gap-3 mb-2">
                              <div className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center text-peach">
                                  <Mic className="w-4 h-4" />
                              </div>
                              <span className="text-xs font-semibold uppercase text-stone-400">Tonality</span>
                          </div>
                          <div className="w-full flex gap-1 items-end h-8 mb-2">
                              <div className="w-1 bg-stone-700 h-3 rounded-full"></div>
                              <div className="w-1 bg-stone-700 h-5 rounded-full"></div>
                              <div className="w-1 bg-peach h-8 rounded-full"></div>
                              <div className="w-1 bg-peach h-6 rounded-full"></div>
                              <div className="w-1 bg-stone-700 h-4 rounded-full"></div>
                          </div>
                          <p className="text-xs text-stone-400">Voice trembling. <span className="text-white">Slow down.</span></p>
                      </div>

                      {/* Left Card 2 */}
                      <div className="flying-card-3 absolute bottom-0 left-[20%] w-56 bg-white/80 backdrop-blur p-4 rounded-2xl shadow-lg border border-stone-100 z-0 hidden md:block">
                          <div className="flex gap-2 items-center">
                              <div className="w-8 h-8 rounded-full bg-stone-100 overflow-hidden">
                                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" />
                              </div>
                              <div className="text-xs">
                                  <p className="font-semibold text-stone-900">Boss</p>
                                  <p className="text-stone-500">Typing...</p>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          {/* Marquee */}
          <div className="w-full bg-stone-900 py-6 border-y border-stone-800">
              <div className="marquee-container text-peach overflow-hidden">
                  <div className="marquee-content animate-marquee text-xs font-bold uppercase tracking-[0.2em]">
                      {[...Array(6)].map((_, i) => (
                        <React.Fragment key={i}>
                          <span> • Social Intelligence</span>
                          <span> • Charisma Coaching</span>
                          <span> • Real-time Analysis</span>
                          <span> • Body Language</span>
                          <span> • Voice Tonality</span>
                        </React.Fragment>
                      ))}
                  </div>
              </div>
          </div>

          {/* Scrolling Text Reveal */}
          <section className="min-h-screen flex items-center justify-center bg-stone-900 py-48 relative overflow-hidden" id="method">
              <div className="absolute inset-0 opacity-10 noise-bg mix-blend-overlay"></div>
              <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                  <p className="text-reveal text-3xl md:text-5xl font-serif leading-tight text-stone-600" id="revealText">
                      <span className="opacity-20 transition-all duration-500">Social anxiety is just </span>
                      <span className="opacity-20 transition-all duration-500">missing data. </span>
                      <span className="opacity-20 transition-all duration-500 text-stone-100">Sorar fills the gaps. </span>
                      <span className="opacity-20 transition-all duration-500 text-stone-100">It reads the room </span>
                      <span className="opacity-20 transition-all duration-500 text-stone-100">when you can't. </span>
                      <span className="opacity-20 transition-all duration-500 text-peach italic">Analyzing micro-expressions, </span>
                      <span className="opacity-20 transition-all duration-500 text-peach italic">speech patterns, </span>
                      <span className="opacity-20 transition-all duration-500 text-stone-100">and </span>
                      <span className="opacity-20 transition-all duration-500 text-stone-100">sentiment. </span>
                      <span className="opacity-20 transition-all duration-500 text-stone-100">Giving you the superpower </span>
                      <span className="opacity-20 transition-all duration-500 text-stone-100">of absolute certainty.</span>
                  </p>
              </div>
          </section>

          {/* Features Section Refreshed */}
          <section id="features" className="relative bg-peach text-stone-900 py-0 overflow-hidden z-30 pb-32">
              
              {/* Marquee Strip */}
              <div className="w-full bg-stone-900 text-peach py-3 border-y border-stone-800 overflow-hidden relative z-20">
                  <div className="marquee-content animate-marquee flex items-center gap-8 whitespace-nowrap font-black uppercase text-xl md:text-2xl tracking-tighter">
                      {[...Array(12)].map((_, i) => (
                           <span key={i} className="flex items-center gap-8">FEATURES <span className="text-white text-3xl">+</span></span>
                      ))}
                  </div>
              </div>

              {/* Background Decor */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <div className="bg-dot-pattern absolute inset-0 opacity-30 mix-blend-multiply"></div>
                  {/* Floating Stones */}
                  <div className="absolute top-20 left-[-50px] w-32 h-24 bg-stone-800 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] opacity-80 blur-[1px] rotate-12 transform hover:scale-110 transition-transform duration-1000"></div>
                  <div className="absolute bottom-40 right-[-20px] w-48 h-36 bg-stone-700 rounded-[50%_50%_30%_70%/60%_40%_70%_30%] opacity-90 blur-[1px] -rotate-6 transform hover:scale-110 transition-transform duration-1000"></div>
                  <div className="absolute top-[40%] right-[10%] w-16 h-12 bg-stone-600 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] opacity-60 blur-[0.5px] rotate-45"></div>

                  {/* Blobs */}
                  <div className="absolute top-[10%] left-[-10%] w-[800px] h-[800px] bg-gradient-to-br from-orange-300 to-rose-300 rounded-full blur-[120px] opacity-30 mix-blend-multiply animate-pulse-ring"></div>
                  <div className="absolute bottom-[10%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-tr from-stone-900 to-stone-500 rounded-full blur-[100px] opacity-10 mix-blend-overlay"></div>
              </div>

              <div className="max-w-7xl mx-auto px-6 py-24 relative z-10 space-y-32">
                  
                  {/* Feature 01 */}
                  <div className="feature-block flex flex-col md:flex-row items-center gap-12 md:gap-24">
                      <div className="w-full md:w-1/2 relative order-2 md:order-1 perspective-container flex justify-center feature-media">
                           {/* Star Shape Behind */}
                           <svg viewBox="0 0 200 200" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] text-white/60 animate-pulse-ring z-0">
                               <path d="M100 0 C130 80 120 70 200 100 C120 130 130 120 100 200 C70 120 80 130 0 100 C80 70 70 80 100 0 Z" fill="currentColor" />
                           </svg>
                           <div className="relative w-[300px] h-[600px] bg-stone-900 rounded-[3rem] shadow-2xl border-[8px] border-stone-800 rotate-y-12 rotate-x-6 hover:rotate-0 transition-transform duration-700 z-10 overflow-hidden feature-phone-1">
                                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80" className="w-full h-full object-cover opacity-80" alt="App Screen" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8">
                                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl">
                                        <p className="text-white font-medium text-sm">"Say: That's fascinating..."</p>
                                    </div>
                                </div>
                           </div>
                      </div>
                      <div className="w-full md:w-1/2 space-y-4 md:pl-10 order-1 md:order-2 text-center md:text-left feature-text">
                          <span className="font-serif italic text-3xl text-stone-600">01</span>
                          <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] text-stone-900">
                              Real Time<br/>
                              <span className="text-white drop-shadow-md">Assist</span>
                          </h2>
                          <div className="relative z-10">
                              <p className="text-xl text-stone-700 max-w-md font-medium leading-relaxed mt-6">
                                  Never run out of words. Get contextual suggestions instantly whispered in your ear.
                              </p>
                          </div>
                      </div>
                  </div>

                  {/* Feature 02 */}
                  <div className="feature-block flex flex-col md:flex-row items-center gap-12 md:gap-24">
                       <div className="w-full md:w-1/2 space-y-4 md:pr-10 text-center md:text-right feature-text z-20">
                          <span className="font-serif italic text-3xl text-stone-600">02</span>
                          <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] text-stone-900">
                              Aura<br/>
                              <span className="text-white drop-shadow-md">Analytics</span>
                          </h2>
                          <div className="relative z-10 flex justify-end">
                              <p className="text-xl text-stone-700 max-w-md font-medium leading-relaxed mt-6">
                                  Track your charisma score daily using advanced computer vision and voice tonality analysis.
                              </p>
                          </div>
                      </div>

                      <div className="w-full md:w-1/2 relative perspective-container flex justify-center feature-media">
                           {/* Star Shape Behind */}
                           <svg viewBox="0 0 200 200" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] text-white/60 animate-pulse-ring z-0">
                               <path d="M100 0 C130 80 120 70 200 100 C120 130 130 120 100 200 C70 120 80 130 0 100 C80 70 70 80 100 0 Z" fill="currentColor" />
                           </svg>
                           <div className="relative w-[300px] h-[600px] bg-white rounded-[3rem] shadow-2xl border-[8px] border-white -rotate-y-12 rotate-x-6 hover:rotate-0 transition-transform duration-700 z-10 overflow-hidden feature-phone-2">
                                <div className="p-8 flex flex-col h-full bg-stone-50 text-stone-900">
                                    <h3 className="font-serif text-3xl mb-8">Daily Score</h3>
                                    <div className="flex-1 flex items-center justify-center">
                                        <div className="text-8xl font-black text-stone-900 relative">
                                            92
                                            <span className="text-sm absolute -top-4 right-0 font-medium text-stone-400">PTS</span>
                                        </div>
                                    </div>
                                    <div className="h-2 w-full bg-stone-200 rounded-full overflow-hidden">
                                        <div className="h-full w-[92%] bg-stone-900"></div>
                                    </div>
                                </div>
                           </div>
                      </div>
                  </div>

                  {/* Feature 03 */}
                  <div className="feature-block flex flex-col md:flex-row items-center gap-12 md:gap-24">
                      <div className="w-full md:w-1/2 relative order-2 md:order-1 perspective-container flex justify-center feature-media">
                           {/* Star Shape Behind */}
                           <svg viewBox="0 0 200 200" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] text-white/60 animate-pulse-ring z-0">
                               <path d="M100 0 C130 80 120 70 200 100 C120 130 130 120 100 200 C70 120 80 130 0 100 C80 70 70 80 100 0 Z" fill="currentColor" />
                           </svg>
                           <div className="relative w-[300px] h-[600px] bg-stone-900 rounded-[3rem] shadow-2xl border-[8px] border-stone-800 rotate-y-12 rotate-x-6 hover:rotate-0 transition-transform duration-700 z-10 overflow-hidden feature-phone-3">
                                <img src="https://images.unsplash.com/photo-1542596768-5d1d21f1cf3d?auto=format&fit=crop&w=600&q=80" className="w-full h-full object-cover" alt="Games" />
                                <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black to-transparent">
                                    <div className="bg-peach text-stone-900 p-4 rounded-xl font-bold text-center">
                                        Start Simulation
                                    </div>
                                </div>
                           </div>
                      </div>
                      <div className="w-full md:w-1/2 space-y-4 md:pl-10 order-1 md:order-2 text-center md:text-left feature-text">
                          <span className="font-serif italic text-3xl text-stone-600">03</span>
                          <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] text-stone-900">
                              Social<br/>
                              <span className="text-white drop-shadow-md">Arena</span>
                          </h2>
                          <div className="relative z-10">
                              <p className="text-xl text-stone-700 max-w-md font-medium leading-relaxed mt-6">
                                  Practice high-stakes scenarios in a safe environment. Level up your social stats before the real thing.
                              </p>
                          </div>
                      </div>
                  </div>

              </div>
          </section>

          {/* Horizontal Scroll Section (GSAP Pinned - Light Luxury) */}
          <section id="arsenal" className="horizontal-section bg-[#f5f5f4] relative overflow-hidden">
              {/* Luxury Light Background */}
              <div className="absolute inset-0 z-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#ffffff] via-[#fff1e6] to-[#ffe4d6]"></div>
                  
                  {/* Subtle Peach Aurora */}
                  <div className="absolute top-[-10%] left-[20%] w-[60vw] h-[60vw] bg-peach/20 rounded-full blur-[100px] animate-[pulse_10s_ease-in-out_infinite]"></div>
                  <div className="absolute bottom-[-10%] right-[10%] w-[50vw] h-[50vw] bg-orange-200/20 rounded-full blur-[100px] animate-[pulse_15s_ease-in-out_infinite_reverse]"></div>
                  
                  {/* Light Grain */}
                  <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-40 mix-blend-multiply"></div>
              </div>
              
              <div className="horizontal-track flex h-screen w-max items-center relative z-10">
                  
                  {/* Intro Panel: The Invitation (Light) */}
                  <div className="panel w-screen h-screen shrink-0 flex flex-col items-center justify-center relative">
                      <div className="max-w-5xl px-8 text-center relative z-10">
                          <span className="text-stone-500 tracking-[0.3em] text-sm uppercase mb-8 block font-medium">The Collection</span>
                          <h2 className="text-[12vw] leading-[0.85] font-serif text-stone-900 mb-8 tracking-tight">
                              Social<br/>
                              <span className="italic text-stone-400">Arsenal</span>
                          </h2>
                          <div className="h-[1px] w-24 bg-stone-900/20 mx-auto mb-8"></div>
                          <p className="text-stone-600 text-xl md:text-2xl max-w-lg mx-auto leading-relaxed font-light font-serif italic">
                              "Tools so advanced, they feel like unfair advantages."
                          </p>
                      </div>
                  </div>

                   {/* Card 1: Live Whisper - Dark Card on Light BG */}
                   <div className="panel w-screen h-screen shrink-0 flex items-center justify-center">
                       <div className="w-full max-w-7xl px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                            {/* Text Side (Dark Text) */}
                            <div className="order-2 md:order-1 space-y-8">
                                <div className="flex items-center gap-4 text-stone-400">
                                    <span className="text-sm font-mono">01</span>
                                    <div className="h-[1px] w-12 bg-stone-300"></div>
                                    <span className="text-sm uppercase tracking-widest">Real-time Audio</span>
                                </div>
                                <h3 className="text-6xl md:text-8xl font-serif text-stone-900 leading-none">Live<br/> <span className="text-stone-400 italic">Whisper</span></h3>
                                <p className="text-stone-600 text-lg leading-relaxed max-w-md border-l border-stone-300 pl-6">
                                    Suggestions fed directly to your ear. It analyzes the conversation flow and feeds you the perfect line, exactly when you need it.
                                </p>
                            </div>
                            
                            {/* Visual Side (Dark Premium Card) */}
                            <div className="order-1 md:order-2 flex justify-center">
                                <div className="relative w-[340px] h-[640px] bg-[#0c0c0c] rounded-[3rem] shadow-2xl overflow-hidden group border border-stone-200">
                                     <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                                     <div className="absolute inset-0 flex flex-col justify-between p-8">
                                         <div className="flex justify-between items-center text-stone-500">
                                             <div className="w-12 h-1 bg-stone-800 rounded-full"></div>
                                             <Zap className="w-4 h-4 text-peach" />
                                         </div>
                                         <div className="space-y-2 opacity-50">
                                              {[...Array(8)].map((_, i) => (
                                                  <div key={i} className="h-[1px] bg-stone-700 w-full animate-pulse" style={{ width: `${Math.random() * 60 + 40}%`, animationDelay: `${i * 0.1}s` }}></div>
                                              ))}
                                          </div>
                                         <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-white/5 relative overflow-hidden">
                                             <div className="absolute top-0 left-0 w-1 h-full bg-peach"></div>
                                             <p className="font-serif text-xl text-white italic leading-snug">"Ask about the timeline distraction..."</p>
                                         </div>
                                     </div>
                                </div>
                            </div>
                       </div>
                   </div>

                   {/* Card 2: Aura Reader */}
                   <div className="panel w-screen h-screen shrink-0 flex items-center justify-center">
                       <div className="w-full max-w-7xl px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                            {/* Visual Side (Dark Card) */}
                            <div className="order-1 flex justify-center relative">
                                <div className="w-[500px] h-[500px] bg-black/5 rounded-full relative flex items-center justify-center backdrop-blur-sm border border-black/5">
                                     <div className="absolute inset-0 border border-stone-900/10 rounded-full"></div>
                                     <div className="absolute inset-12 border border-stone-900/20 rounded-full"></div>
                                     <div className="absolute top-1/2 left-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent to-peach origin-left animate-[spin_4s_linear_infinite]"></div>
                                     <div className="relative z-10 text-center">
                                         <div className="text-9xl font-serif text-stone-900">94</div>
                                         <div className="text-xs uppercase tracking-[0.3em] text-peach mt-2 font-bold">Charisma Score</div>
                                     </div>
                                </div>
                            </div>
                            
                            {/* Text Side */}
                            <div className="order-2 space-y-8 pl-0 md:pl-12">
                                <div className="flex items-center gap-4 text-stone-400">
                                    <span className="text-sm font-mono">02</span>
                                    <div className="h-[1px] w-12 bg-stone-300"></div>
                                    <span className="text-sm uppercase tracking-widest">Computer Vision</span>
                                </div>
                                <h3 className="text-6xl md:text-8xl font-serif text-stone-900 leading-none">Aura<br/> <span className="text-stone-400 italic">Reader</span></h3>
                                <p className="text-stone-600 text-lg leading-relaxed max-w-md border-l border-stone-300 pl-6">
                                    Quantify your presence. Our dedicated vision metrics analyze posture, eye contact, and micro-expressions 60 times per second.
                                </p>
                            </div>
                       </div>
                   </div>

                   {/* Card 3: Game Tape */}
                   <div className="panel w-screen h-screen shrink-0 flex items-center justify-center">
                       <div className="w-full max-w-7xl px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                            {/* Text Side */}
                            <div className="order-2 md:order-1 space-y-8">
                                <div className="flex items-center gap-4 text-stone-400">
                                    <span className="text-sm font-mono">03</span>
                                    <div className="h-[1px] w-12 bg-stone-300"></div>
                                    <span className="text-sm uppercase tracking-widest">Post-Game Analysis</span>
                                </div>
                                <h3 className="text-6xl md:text-8xl font-serif text-stone-900 leading-none">Game<br/> <span className="text-stone-400 italic">Tape</span></h3>
                                <p className="text-stone-600 text-lg leading-relaxed max-w-md border-l border-stone-300 pl-6">
                                    Review your interactions with athlete-level precision. Identify the exact second you won the room, or where you lost the deal.
                                </p>
                            </div>
                            
                            {/* Visual Side */}
                            <div className="order-1 md:order-2 flex justify-center">
                                <div className="w-full max-w-md space-y-1">
                                    <div className="flex justify-between text-[10px] uppercase text-stone-400 mb-2 font-mono">
                                        <span>00:00</span>
                                        <span>00:15</span>
                                        <span>00:30</span>
                                    </div>
                                    <div className="flex items-end h-48 gap-[2px]">
                                        {[...Array(40)].map((_, i) => (
                                            <div 
                                                key={i} 
                                                className={`w-full bg-stone-400 hover:bg-stone-900 transition-colors duration-300 rounded-t-[1px] ${i > 25 ? 'bg-orange-500' : ''}`} 
                                                style={{ height: `${20 + Math.random() * 80}%` }}
                                            ></div>
                                        ))}
                                    </div>
                                    <div className="h-[1px] w-full bg-stone-200 mt-4"></div>
                                    <div className="flex justify-between items-center mt-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-peach"></div>
                                            <span className="text-xs text-stone-500 uppercase tracking-wider">Recording</span>
                                        </div>
                                        <BarChart2 className="w-4 h-4 text-stone-400" />
                                    </div>
                                </div>
                            </div>
                       </div>
                   </div>

              </div>
          </section>

          {/* Results & Testimonials Section */}
          <section className="bg-stone-900 text-white py-32 relative overflow-hidden" id="results">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-20">
                    
                    {/* Sticky Left Column: Headline & Stats */}
                    <div className="relative">
                        <div className="sticky top-32 space-y-16">
                            <h2 className="text-5xl md:text-7xl font-serif leading-[0.9]">
                                Results that<br/>
                                <span className="text-stone-400">speak loudly.</span>
                            </h2>
                            
                            <div className="space-y-12">
                                <div>
                                    <div className="text-4xl md:text-5xl font-bold text-peach mb-2">2.5x</div>
                                    <p className="text-stone-400 text-sm uppercase tracking-widest font-medium">Increase in second date rates</p>
                                </div>
                                <div>
                                    <div className="text-4xl md:text-5xl font-bold text-peach mb-2">40%</div>
                                    <p className="text-stone-400 text-sm uppercase tracking-widest font-medium">Salary bump for premium users</p>
                                </div>
                                <div>
                                    <div className="text-4xl md:text-5xl font-bold text-peach mb-2">12k+</div>
                                    <p className="text-stone-400 text-sm uppercase tracking-widest font-medium">Awkward silences prevented</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Scrolling Right Column: Testimonials */}
                    <div className="space-y-8 pt-32 md:pt-0">
                        {/* Review Card 1 */}
                        <div className="bg-stone-800/30 border border-stone-800 p-8 rounded-3xl backdrop-blur-sm">
                            <p className="text-lg md:text-xl text-stone-300 italic mb-6 leading-relaxed">"I finally asked for that raise without stuttering. My heart rate stayed under 90 the whole time."</p>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-stone-700"></div>
                                <div>
                                    <p className="text-sm font-bold text-white">Marcus, NY</p>
                                    <div className="flex text-peach text-xs">★★★★★</div>
                                </div>
                            </div>
                        </div>

                        {/* Review Card 2 (Highlight) */}
                        <div className="bg-stone-800/80 border border-stone-700 p-10 rounded-3xl shadow-2xl relative">
                            <div className="absolute top-0 right-0 p-6 opacity-20"><span className="text-6xl font-serif text-peach">"</span></div>
                            <p className="text-xl md:text-2xl text-white font-medium mb-8 leading-relaxed">"The aura tracking is addictive. I treat my social skills like a video game now. My confidence has skyrocketed."</p>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-peach to-orange-400"></div>
                                <div>
                                    <p className="text-sm font-bold text-white">Sarah, London</p>
                                    <p className="text-xs text-stone-400 uppercase tracking-widest">Premium User</p>
                                </div>
                            </div>
                        </div>

                        {/* Review Card 3 */}
                        <div className="bg-stone-800/30 border border-stone-800 p-8 rounded-3xl backdrop-blur-sm">
                            <p className="text-lg md:text-xl text-stone-300 italic mb-6 leading-relaxed">"Sorar suggested a joke when I froze. The whole table laughed. Life changing moment honestly."</p>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-stone-700"></div>
                                <div>
                                    <p className="text-sm font-bold text-white">David, Toronto</p>
                                    <div className="flex text-peach text-xs">★★★★★</div>
                                </div>
                            </div>
                        </div>

                         {/* Review Card 4 */}
                         <div className="bg-stone-800/30 border border-stone-800 p-8 rounded-3xl backdrop-blur-sm opacity-60">
                            <p className="text-lg md:text-xl text-stone-300 italic mb-6 leading-relaxed">"It's like having a charisma coach in your pocket 24/7. The real-time feedback is insane."</p>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-stone-700"></div>
                                <div>
                                    <p className="text-sm font-bold text-white">Elena, Madrid</p>
                                    <div className="flex text-peach text-xs">★★★★★</div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
          </section>



          {/* Dark Aura Section (Redesigned) */}
          <section id="dark-aura-section" className="max-w-7xl mx-auto px-4 sm:px-6 mb-32 mt-32">
              <div className="bg-[#1a1716] rounded-[3rem] p-12 md:p-24 relative overflow-hidden flex flex-col md:flex-row items-center justify-between min-h-[600px] shadow-2xl">
                  
                  {/* Background Ambient Glows */}
                  <div className="absolute inset-0 pointer-events-none">
                       {/* Purple/Blue Haze on Right */}
                       <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-[#2a2438] rounded-full blur-[120px] opacity-60 mix-blend-screen"></div>
                       {/* Warm Glow Bottom Left */}
                       <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#362018] rounded-full blur-[100px] opacity-40 mix-blend-screen"></div>
                  </div>

                  {/* Left Content */}
                  <div className="relative z-10 w-full md:w-1/2 space-y-10">
                      <div className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-stone-400 text-[10px] font-bold uppercase tracking-widest">New Feature</div>
                      
                      <h2 className="text-5xl md:text-7xl font-serif text-white leading-[1.05] tracking-tight">
                          Master your <br />
                          <span className="text-peach italic">Aura & Presence</span>
                      </h2>
                      
                      <p className="text-stone-400 text-lg md:text-xl font-light leading-relaxed max-w-md">
                          Track your daily Aura Score based on movement, vocal tonality, and eye contact. Gamify your social growth.
                      </p>
                      
                      <button className="bg-[#f5d0c0] text-[#1a1716] text-sm font-bold px-8 py-4 rounded-full hover:bg-white hover:scale-105 transition-all duration-300 flex items-center gap-3 shadow-lg shadow-peach/10">
                          Start Aura Training <ArrowRight className="w-4 h-4" />
                      </button>
                  </div>

                  {/* Right Floating Card */}
                  <div className="relative z-10 mt-20 md:mt-0 w-full md:w-auto">
                      <div className="w-[340px] h-[340px] bg-[#1c1917] rounded-[2.5rem] p-8 shadow-2xl border border-white/5 relative group hover:-translate-y-2 transition-transform duration-500">
                          <div className="flex justify-between items-start mb-12">
                              <h3 className="text-xl font-bold text-white tracking-wide">Daily Aura</h3>
                              <div className="w-10 h-10 rounded-full bg-[#f5d0c0] flex items-center justify-center text-[#1a1716]">
                                  <Crown className="w-5 h-5" />
                              </div>
                          </div>
                          
                          <div className="flex flex-col items-center justify-center h-40">
                              <span className="text-8xl font-serif text-white leading-none group-hover:scale-110 transition-transform duration-500">82</span>
                              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.3em] mt-4">Excellent</span>
                          </div>

                          {/* Subtle ring glow */}
                          <div className="absolute inset-0 rounded-[2.5rem] ring-1 ring-white/5 group-hover:ring-peach/20 transition-all duration-500"></div>
                      </div>
                  </div>

              </div>
          </section>

          {/* Scroll Stack Animation (Card Stack Section) */}
          {/* Scroll Stack Animation (Card Stack Section) */}
          <section className="bg-[#F5F5F4] relative stack-section py-24 px-6 min-h-screen flex flex-col items-center justify-center overflow-visible" id="scenarios">
               
               {/* Fixed Header (will stay visible while pinned) */}
               <div className="text-center mb-16 relative z-10">
                  <h2 className="text-4xl md:text-6xl font-medium tracking-tight mb-4 text-stone-900">Practice Makes<br />Permanent.</h2>
                  <p className="text-stone-500 max-w-lg mx-auto">Master every scenario before it happens. Our AI roleplays feel real, so the results are real.</p>
              </div>

              {/* Stack Container */}
              <div className="relative w-full max-w-md h-[450px] md:h-[500px] z-20 perspective-1000" id="scenarios-container">
                  
                  {/* Card 1: Interview */}
                  <div className="stack-card absolute top-0 left-0 w-full bg-white rounded-[2rem] p-8 shadow-xl border border-stone-200 h-full flex flex-col justify-between">
                      <div>
                          <div className="w-12 h-12 bg-peach rounded-xl flex items-center justify-center mb-6">
                              <Briefcase className="w-6 h-6 text-stone-900" />
                          </div>
                          <h3 className="text-3xl font-serif mb-2">The Interview</h3>
                          <p className="text-stone-500 text-sm leading-relaxed">Simulate high-pressure salary negotiations and behavioral questions with an aggressive AI recruiter.</p>
                      </div>
                      <button className="w-full mt-6 py-3 border border-stone-200 rounded-full text-xs font-bold uppercase hover:bg-stone-900 hover:text-white transition-colors">Start Simulation</button>
                  </div>

                  {/* Card 2: First Date */}
                  <div className="stack-card absolute top-0 left-0 w-full bg-peach rounded-[2rem] p-8 shadow-xl border border-orange-200 h-full flex flex-col justify-between">
                      <div>
                          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm">
                              <Heart className="w-6 h-6 text-red-500 fill-current" />
                          </div>
                          <h3 className="text-3xl font-serif mb-2 text-stone-900">First Date</h3>
                          <p className="text-stone-800 text-sm leading-relaxed">Practice breaking the ice, storytelling, and flirting dynamics with a personality-matched AI date.</p>
                      </div>
                      <button className="w-full mt-6 py-3 bg-stone-900 text-white rounded-full text-xs font-bold uppercase hover:bg-stone-800 transition-colors">Start Simulation</button>
                  </div>

                  {/* Card 3: Networking */}
                  <div className="stack-card absolute top-0 left-0 w-full bg-[#1c1917] text-white rounded-[2rem] p-8 shadow-xl border border-stone-800 h-full flex flex-col justify-between">
                      <div>
                          <div className="w-12 h-12 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center mb-6 border border-white/10">
                              <Users className="w-6 h-6 text-peach" />
                          </div>
                          <h3 className="text-3xl font-serif mb-2">Networking</h3>
                          <p className="text-stone-400 text-sm leading-relaxed">Learn how to enter group conversations and exit gracefully without awkwardness.</p>
                      </div>
                      <button className="w-full mt-6 py-3 bg-peach text-stone-900 rounded-full text-xs font-bold uppercase hover:bg-white transition-colors">Start Simulation</button>
                  </div>

              </div>
          </section>

          {/* Footer / Waitlist Section */}
          <footer className="bg-peach pt-24 pb-8 px-4" id="waitlist">
              <div className="max-w-4xl mx-auto bg-white rounded-[3rem] p-8 md:p-16 text-center shadow-2xl relative overflow-hidden mb-12">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-peach rounded-full blur-[100px] opacity-50 pointer-events-none"></div>
                  <div className="relative z-10">
                      <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 text-stone-900">Join The Waitlist</h2>
                      <p className="text-stone-500 mb-10 max-w-md mx-auto">Get exclusive access to the beta and a personalized Aura analysis report.</p>
                      
                      {submitted ? (
                         <div className="bg-green-100 text-green-800 px-6 py-4 rounded-full font-bold uppercase tracking-wide inline-block animate-fade-in-up">
                            You're on the list! Speak soon.
                         </div>
                      ) : (
                        <form onSubmit={handleWaitlistSubmit} className="max-w-lg mx-auto relative group">
                            <input 
                              type="email" 
                              placeholder="YOUR EMAIL" 
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="w-full bg-[#F5F5F4] text-stone-900 font-bold placeholder:text-stone-300 placeholder:font-bold px-8 py-6 rounded-full outline-none focus:ring-2 focus:ring-stone-200 transition-all text-sm uppercase tracking-wide" 
                              required
                            />
                            <button type="submit" className="absolute right-2 top-2 bottom-2 bg-stone-900 text-white px-6 rounded-full hover:scale-95 transition-transform flex items-center justify-center aspect-square md:aspect-auto md:px-8">
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </form>
                      )}
                  </div>
              </div>
              
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-xs font-bold uppercase tracking-wider text-stone-700 pt-8 border-t border-stone-900/10">
                  <p>© Sorar App - All Rights Reserved 2024</p>
                  <div className="flex gap-6 mt-4 md:mt-0">
                      <a href="#" className="hover:text-black transition-colors"><Instagram className="w-4 h-4" /></a>
                      <a href="#" className="hover:text-black transition-colors"><Twitter className="w-4 h-4" /></a>
                  </div>
              </div>
          </footer>

      </main>
    </div>
  );
}

export default App;
