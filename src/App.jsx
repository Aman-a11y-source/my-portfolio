import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code2, BrainCircuit, Rocket, GraduationCap, Github, Linkedin, Twitter, Mail, ExternalLink, Terminal, Cpu, PenTool, Bot, Sparkles, Zap, Send, X
} from 'lucide-react';

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap');
    body { font-family: 'Patrick Hand', cursive; background-color: #fdf6e3; margin: 0; padding: 0; overflow-x: hidden; }
    .paper-pattern { background-image: linear-gradient(#999 1px, transparent 1px); background-size: 100% 2em; }
    .sketch-border { border: 2px solid #2c3e50; border-radius: 2px 255px 3px 25px / 255px 5px 225px 5px; box-shadow: 2px 3px 0px rgba(0,0,0,0.8); transition: all 0.2s ease; }
    .sketch-border:hover { box-shadow: 4px 6px 0px rgba(0,0,0,0.9); transform: translate(-1px, -2px); }
    .marker-highlight { background: linear-gradient(120deg, #f6d365 0%, #fda085 100%); background-repeat: no-repeat; background-size: 100% 40%; background-position: 0 88%; }
    ::-webkit-scrollbar { width: 10px; }
    ::-webkit-scrollbar-track { background: #fdf6e3; }
    ::-webkit-scrollbar-thumb { background: #2c3e50; border-radius: 5px; border: 2px solid #fdf6e3; }
  `}</style>
);

const AIBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([{ role: 'ai', text: "Psst! I'm Aman's digital brain. Ask me anything about him!" }]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages]);

  const handleAsk = async () => {
    if (!query.trim()) return;
    const userMsg = query;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setQuery('');
    setLoading(true);
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

      if (!apiKey) {
        throw new Error("API Key Missing in .env file");
      }

      const systemPrompt = "You are a witty, fun AI assistant for Aman Brahma's portfolio website. Aman is a 2nd-year CSE student at NIT Durgapur, passionate about GenAI, C++, and building scalable systems. He has solved 150+ LeetCode problems. Keep answers short, casual, and slightly humorous (Gen Z style). Don't mention Gemini. Act like a sketch-bot living in this paper website.";


      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: `User: ${userMsg}` }] }], systemInstruction: { parts: [{ text: systemPrompt }] } })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "API Error");
      }

      const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "My ink is running dry... try again later!";
      setMessages(prev => [...prev, { role: 'ai', text: botReply }]);
    } catch (error) {
      console.error("Bot Error:", error);
      setMessages(prev => [...prev, { role: 'ai', text: `Ouch! Error: ${error.message}` }]);
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-auto">
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, scale: 0.8, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8, y: 20 }} className="mb-4 w-80 bg-white sketch-border p-4 flex flex-col relative shadow-2xl">
            <div className="flex justify-between items-center border-b-2 border-slate-100 pb-2 mb-2">
              <span className="font-bold flex items-center gap-2"><Bot size={18} /> Doodle Bot</span>
              <button onClick={() => setIsOpen(false)} className="hover:text-red-500 transition-colors"><X size={18} /></button>
            </div>
            <div ref={scrollRef} className="h-64 overflow-y-auto mb-4 space-y-3 pr-2">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-2 rounded-lg text-sm font-bold ${msg.role === 'user' ? 'bg-slate-800 text-white rounded-br-none' : 'bg-yellow-100 text-slate-800 rounded-bl-none border-2 border-slate-800'}`}>{msg.text}</div>
                </div>
              ))}
              {loading && <div className="flex justify-start"><div className="bg-slate-100 p-2 rounded-lg text-xs animate-pulse">Thinking...</div></div>}
            </div>
            <div className="flex gap-2 relative">
              <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAsk()} placeholder="Ask about Aman..." className="w-full bg-slate-50 border-2 border-slate-300 rounded p-2 text-sm focus:outline-none focus:border-slate-800 transition-colors" />
              <button onClick={handleAsk} disabled={loading} className="bg-slate-800 text-white p-2 rounded hover:bg-slate-900 transition-colors disabled:opacity-50"><Send size={16} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button whileHover={{ scale: 1.1, rotate: 10 }} whileTap={{ scale: 0.9 }} onClick={() => setIsOpen(!isOpen)} className="sketch-border p-4 bg-yellow-300 text-slate-900 rounded-full shadow-lg flex items-center justify-center relative group">
        <Bot size={28} />
        {!isOpen && <span className="absolute -top-2 -right-2 flex h-4 w-4"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span></span>}
        {!isOpen && <div className="absolute right-full mr-4 bg-white px-3 py-1 rounded sketch-border text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">Ask the AI!</div>}
      </motion.button>
    </div>
  );
};

const Doodles = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
    <motion.svg initial={{ rotate: 0 }} animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute top-32 left-[10%] w-12 h-12 text-yellow-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></motion.svg>
    <svg className="absolute bottom-32 right-[15%] w-24 h-24 text-slate-400 rotate-12" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 10 Q 50 50 90 10 M 90 10 L 80 30 M 90 10 L 70 10" /></svg>
    <svg className="absolute bottom-20 left-[5%] w-32 h-32 text-cyan-500/50" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 50 Q 25 25 50 50 T 90 50" /></svg>
    <div className="absolute top-28 right-[10%]"><div className="w-8 h-8 border-2 border-slate-800 rounded-full"></div><div className="w-4 h-4 border-2 border-slate-800 rounded-full ml-6 -mt-2"></div></div>
  </div>
);

const BackgroundScene = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    if (mountRef.current) mountRef.current.appendChild(renderer.domElement);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-100, -100);

    const handleMouseMove = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const createSketchMesh = (geometry, color = 0x2c3e50, opacity = 0.15) => {
      const material = new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity });
      return new THREE.Mesh(geometry, material);
    };

    const shapes = [];

    const mainShape = createSketchMesh(new THREE.IcosahedronGeometry(1.6, 1));
    scene.add(mainShape);
    shapes.push({ mesh: mainShape, speedRot: { x: 0.001, y: 0.002 }, basePos: { x: 0, y: 0, z: 0 }, originalScale: 1 });

    const torus = createSketchMesh(new THREE.TorusGeometry(0.8, 0.2, 16, 32), 0x2c3e50, 0.1);
    torus.position.set(3, 1.5, -2);
    scene.add(torus);
    shapes.push({ mesh: torus, speedRot: { x: 0.005, y: -0.003 }, basePos: { x: 3, y: 1.5, z: -2 }, originalScale: 1 });

    const cone = createSketchMesh(new THREE.ConeGeometry(0.6, 1.2, 4), 0x2c3e50, 0.1);
    cone.position.set(-3, -1, -1);
    scene.add(cone);
    shapes.push({ mesh: cone, speedRot: { x: 0.002, y: 0.005 }, basePos: { x: -3, y: -1, z: -1 }, originalScale: 1 });

    for (let i = 0; i < 5; i++) {
      const size = 0.2 + Math.random() * 0.3;
      const octa = createSketchMesh(new THREE.OctahedronGeometry(size, 0), 0x555555, 0.08);
      const x = (Math.random() - 0.5) * 10;
      const y = (Math.random() - 0.5) * 6;
      const z = -2 - Math.random() * 5;
      octa.position.set(x, y, z);
      scene.add(octa);
      shapes.push({ mesh: octa, speedRot: { x: Math.random() * 0.01, y: Math.random() * 0.01 }, basePos: { x, y, z }, originalScale: 1 });
    }

    const animate = () => {
      requestAnimationFrame(animate);
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = maxScroll > 0 ? scrollY / maxScroll : 0;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(shapes.map(s => s.mesh));
      const hoveredMesh = intersects.length > 0 ? intersects[0].object : null;

      shapes.forEach(item => {
        let rotationSpeedX = item.speedRot.x;
        let rotationSpeedY = item.speedRot.y;
        let targetScale = item.originalScale;

        if (item.mesh === hoveredMesh) {
          rotationSpeedX *= 5;
          rotationSpeedY *= 5;
          targetScale = item.originalScale * 1.3;
          item.mesh.material.opacity = 0.4;
          item.mesh.material.color.setHex(0xf43f5e);
        } else {
          item.mesh.material.opacity = item.mesh === mainShape ? 0.15 : 0.1;
          item.mesh.material.color.setHex(item.mesh === mainShape || item.mesh === torus || item.mesh === cone ? 0x2c3e50 : 0x555555);
        }

        item.mesh.rotation.x += rotationSpeedX;
        item.mesh.rotation.y += rotationSpeedY;

        item.mesh.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

        item.mesh.position.y = item.basePos.y + (scrollProgress * 2);
      });

      let targetX = 0;
      if (scrollProgress >= 0.2 && scrollProgress < 0.55) {
        targetX = -2.0;
      } else if (scrollProgress >= 0.55 && scrollProgress < 0.85) {
        targetX = 2.0;
      }

      mainShape.position.x += (targetX - mainShape.position.x) * 0.05;

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (mountRef.current && renderer.domElement) mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -20, pointerEvents: 'none', display: 'block' }} />;
};

const SkillBadge = ({ name, icon: Icon }) => (
  <motion.div whileHover={{ scale: 1.05, rotate: -2 }} className="sketch-border flex items-center gap-2 px-3 py-1 md:px-4 md:py-2 bg-white text-slate-800 cursor-pointer">
    {Icon && <Icon size={18} className="text-slate-800" />}
    <span className="text-sm md:text-lg font-bold">{name}</span>
  </motion.div>
);

const ProjectCard = ({ title, desc, tags, link, isPlaceholder = false }) => {
  const cardContent = (
    <div className={`relative h-full p-6 bg-white block ${isPlaceholder ? 'border-2 border-dashed border-slate-400' : 'sketch-border'}`}>
      {isPlaceholder && <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none"><div className="text-8xl font-bold rotate-[-15deg]">?</div></div>}
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 border-2 border-slate-800 rounded-full">{isPlaceholder ? <PenTool className="text-slate-500" /> : <Code2 className="text-slate-800" />}</div>
          {!isPlaceholder && <ExternalLink className="text-slate-600 hover:text-black cursor-pointer" size={20} />}
        </div>
        <h3 className={`text-2xl font-bold mb-2 ${isPlaceholder ? 'text-slate-500' : 'text-slate-900'} marker-highlight inline-block`}>{title}</h3>
        <p className={`text-lg mb-6 flex-grow ${isPlaceholder ? 'text-slate-500 italic' : 'text-slate-700'}`}>{desc}</p>
        <div className="flex flex-wrap gap-2 mt-auto">{tags.map((tag, i) => <span key={i} className={`text-sm font-bold px-2 py-1 border border-slate-600 rounded ${isPlaceholder ? 'bg-slate-100 text-slate-400' : 'bg-yellow-100 text-slate-800'}`}>#{tag}</span>)}</div>
      </div>
    </div>
  );

  if (link) {
    return (
      <motion.a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: -5, rotate: 1 }}
        className="block h-full cursor-pointer no-underline text-inherit"
      >
        {cardContent}
      </motion.a>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={{ y: -5, rotate: 1 }} className="h-full">
      {cardContent}
    </motion.div>
  );
};

export default function Portfolio() {
  const scrollTo = (id) => { const element = document.getElementById(id); if (element) element.scrollIntoView({ behavior: 'smooth' }); };

  const [formStatus, setFormStatus] = useState("idle");

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormStatus("submitting");

    const formData = new FormData(e.target);

    try {

      const response = await fetch("https://formspree.io/f/xzznpqzl", {
        method: "POST",
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setFormStatus("success");
        e.target.reset();
      } else {
        setFormStatus("error");
      }
    } catch (error) {
      setFormStatus("error");
    }
  };

  return (
    <div className="min-h-screen text-slate-800 paper-pattern overflow-x-hidden selection:bg-yellow-200 relative">
      <GlobalStyles />
      <BackgroundScene />
      <AIBot />

      <nav className="fixed top-0 w-full z-40 px-4 md:px-6 py-3 md:py-4 flex justify-between items-center bg-[#fdf6e3]/95 backdrop-blur-sm border-b-2 border-slate-800">
        <div className="text-xl md:text-2xl font-bold tracking-tighter flex items-center gap-2"><Terminal size={24} className="text-slate-800 md:w-7 md:h-7" /><span className="underline decoration-wavy decoration-yellow-500">Aman Brahma</span></div>
        <div className="hidden md:flex gap-8 text-xl font-bold text-slate-600">{['Home', 'Skills', 'Work', 'About'].map((item) => <button key={item} onClick={() => scrollTo(item.toLowerCase())} className="hover:text-black hover:rotate-2 transition-transform">{item}</button>)}</div>
        <button onClick={() => scrollTo('contact')} className="sketch-border px-3 py-1.5 md:px-5 md:py-2 bg-yellow-300 hover:bg-yellow-400 text-slate-900 font-bold text-sm md:text-base transition-all transform hover:-translate-y-1 active:translate-y-0">Say Hello!</button>
      </nav>

      <section id="home" className="relative min-h-screen flex items-center justify-center px-6 pt-20 overflow-hidden">
        <Doodles />
        <motion.div initial={{ rotate: 10, y: -100 }} animate={{ rotate: 5, y: 0 }} className="absolute top-28 right-6 md:right-20 bg-cyan-200 border-2 border-slate-800 p-3 shadow-md z-20 hidden md:block transform hover:rotate-0 transition-transform cursor-help">
          <div className="flex items-center gap-2 font-bold text-sm"><span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>Status: Caffeinated ☕</div>
        </motion.div>

        <motion.div initial={{ x: -100, rotate: -20 }} animate={{ x: 0, rotate: -5 }} className="absolute top-28 left-6 md:left-20 z-20 hidden md:block group">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-slate-200/80 border border-white/50 rotate-3 z-30 shadow-sm"></div>
          <div className="w-24 h-24 rounded-full border-[3px] border-slate-800 bg-white overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative z-10 group-hover:scale-110 transition-transform">
            <img src="https://pbs.twimg.com/profile_images/1950106402149605376/bPJb0iuI_400x400.jpg" alt="Aman Brahma" className="w-full h-full object-cover" />
          </div>
          <div className="absolute -right-24 top-8 -rotate-12 bg-yellow-300 px-2 py-1 text-xs font-bold border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            &larr; That's me!
          </div>
        </motion.div>

        <div className="max-w-6xl mx-auto text-center z-10 flex flex-col items-center relative mt-12">
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-5xl md:text-9xl font-black mb-6 md:mb-8 tracking-tight text-slate-900 drop-shadow-sm leading-none"
          >
            BUILDING SCALABLE <br />
            <span className="marker-highlight px-3 md:px-6 italic inline-block transform -rotate-1">SYSTEMS & AI.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-lg md:text-3xl text-slate-700 mb-8 md:mb-10 max-w-3xl mx-auto font-bold leading-relaxed px-4">
            Pre-Final Year CSE @ NIT Durgapur. <br /> Obsessed with <span className="underline decoration-wavy decoration-cyan-500">Clean Code</span> & <span className="underline decoration-wavy decoration-purple-500">Neural Nets</span>.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6 w-full px-6 sm:w-auto">
            <button onClick={() => scrollTo('work')} className="sketch-border px-6 py-4 md:px-10 md:py-5 bg-slate-800 text-white font-bold hover:bg-slate-900 text-lg md:text-2xl flex items-center justify-center gap-3"><Rocket size={20} className="md:w-6 md:h-6" /> Check My Work</button>
            <button onClick={() => scrollTo('contact')} className="sketch-border px-6 py-4 md:px-10 md:py-5 bg-white text-slate-800 font-bold hover:bg-yellow-50 text-lg md:text-2xl flex items-center justify-center gap-3"><Mail size={20} className="md:w-6 md:h-6" /> Let's Chat</button>
          </motion.div>
        </div>
      </section>

      <section id="skills" className="py-16 md:py-24 px-6 relative">
        <div className="max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div className="hidden md:block h-64 border-4 border-dashed border-slate-300 rounded-[3rem] flex items-center justify-center opacity-40 relative rotate-2">
            <span className="text-3xl font-bold -rotate-2 text-slate-400">My Brain Dump Area 🧠</span>
            <div className="absolute -top-6 -right-6"><Sparkles size={40} className="text-yellow-500" /></div>
          </div>
          <div>
            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="mb-8 md:mb-12 text-center md:text-left">
              <h2 className="text-4xl md:text-5xl font-black mb-4 flex items-center justify-center md:justify-start gap-3"><Cpu size={32} className="text-slate-800 md:w-10 md:h-10" /> My Toolkit</h2>
              <div className="h-2 w-full bg-slate-800 rounded-full"></div>
            </motion.div>
            <div className="space-y-8 md:space-y-10">
              <div className="bg-white p-6 sketch-border relative hover:rotate-1 transition-transform">
                <div className="absolute -top-4 -left-2 bg-yellow-300 px-2 py-1 border-2 border-black font-bold transform -rotate-3 shadow-sm text-sm md:text-base">Languages</div>
                <div className="flex flex-wrap gap-3 md:gap-4 mt-2">{["C++", "Python", "JavaScript", "C", "Lua"].map(s => <SkillBadge key={s} name={s} />)}</div>
              </div>
              <div className="bg-white p-6 sketch-border relative hover:-rotate-1 transition-transform">
                <div className="absolute -top-4 -right-2 bg-cyan-300 px-2 py-1 border-2 border-black font-bold transform rotate-3 shadow-sm text-sm md:text-base">Gen AI & ML</div>
                <div className="flex flex-wrap gap-3 md:gap-4 mt-2">{[["TensorFlow", BrainCircuit], ["LangChain", Sparkles], ["HuggingFace", Bot], ["RAG", Zap]].map(([n, I]) => <SkillBadge key={n} name={n} icon={I} />)}</div>
              </div>
              <div className="bg-white p-6 sketch-border relative hover:rotate-1 transition-transform">
                <div className="absolute -top-4 -left-2 bg-purple-300 px-2 py-1 border-2 border-black font-bold transform -rotate-2 shadow-sm text-sm md:text-base">Web Stuff</div>
                <div className="flex flex-wrap gap-3 md:gap-4 mt-2">{["React.js", "Tailwind", "Django", "Firebase", "Framer motion", "Node/express", "UI/UX"].map(s => <SkillBadge key={s} name={s} />)}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="work" className="py-16 md:py-24 px-6 border-t-2 border-slate-800 bg-[#fffdf5] relative">
        <div className="absolute top-10 right-10 opacity-10 pointer-events-none"><Code2 size={200} /></div>
        <div className="max-w-6xl mx-auto w-full">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12 md:mb-16 text-center">
            <h2 className="text-4xl md:text-5xl font-black mb-4 inline-block marker-highlight transform -rotate-1">Things I've Built</h2>
            <p className="text-lg md:text-2xl mt-4 text-slate-600 font-bold">Code that actually works (mostly).</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ProjectCard
              title="Project Leonida"
              desc="GTA 6 Clone. Cinematic Scrollytelling with immersive 3D effects. A tribute to Vice City."
              tags={["Next.js", "Three.js", "Tailwind"]}
              link="https://comforting-maamoul-f9df0c.netlify.app/"
            />
            <ProjectCard
              title="Smart Bookstore"
              desc="Full-stack book discovery. Google Books API + Django Auth + Reviews. Clean UI."
              tags={["React", "Django", "API"]}
              link="https://bookstore-project-id4z.onrender.com/"
            />
            <ProjectCard
              title="Secret E-Comm"
              desc="Scalable architecture experiment. Integrating Vector Search for smarter product recs."
              tags={["Next.js", "Docker", "Vector DB"]}
              link="#"
              isPlaceholder={true}
            />
            <div className="sketch-border bg-slate-100 p-6 flex flex-col items-center justify-center text-center gap-4 hover:bg-slate-200 transition-colors">
              <div className="border-4 border-slate-800 rounded-full p-4 bg-white"><Rocket size={40} className="text-slate-800" /></div>
              <h3 className="text-2xl font-bold">More Cooking...</h3>
              <p className="text-lg">Always building something on weekends.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="py-16 md:py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, rotate: 2 }} whileInView={{ opacity: 1, rotate: 0 }} viewport={{ once: true }} className="sketch-border bg-white p-6 md:p-12 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-yellow-200 opacity-80 rotate-2 shadow-sm border-l border-r border-white/50"></div>
            <h2 className="text-3xl md:text-4xl font-black mb-6 md:mb-8 flex items-center gap-3"><GraduationCap size={32} className="md:w-10 md:h-10" /> My Story</h2>
            <div className="space-y-8 text-lg md:text-xl">
              <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                <div className="hidden md:flex flex-col items-center"><div className="w-4 h-4 bg-slate-800 rounded-full mt-2"></div><div className="w-1 h-full bg-slate-300 my-2"></div></div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold border-l-4 border-slate-800 pl-3 md:border-none md:pl-0">NIT Durgapur</h3>
                  <p className="text-slate-600 font-bold pl-4 md:pl-0">B.Tech CSE (2024 - 2028)</p>
                  <p className="mt-2 text-slate-700 pl-4 md:pl-0">Currently in 3rd Sem. <br />CGPA: <span className="bg-yellow-200 px-1 border border-black font-bold">8.93</span></p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                <div className="hidden md:flex flex-col items-center"><div className="w-4 h-4 bg-slate-800 rounded-full mt-2"></div></div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold border-l-4 border-slate-800 pl-3 md:border-none md:pl-0">Code Grind</h3>
                  <p className="text-slate-600 font-bold pl-4 md:pl-0">LeetCode & Problem Solving</p>
                  <p className="mt-2 text-slate-700 pl-4 md:pl-0">Solved 150+ problems. Deep diving into Graphs & DP.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      <section id="contact" className="py-16 md:py-24 px-6 mb-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-black mb-6 md:mb-8">Let's Connect!</h2>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-8 md:mb-12">
            {[
              { Icon: Github, link: "https://github.com/Aman-a11y-source" },
              { Icon: Linkedin, link: "https://www.linkedin.com/in/aman-brahma-141282315/" },
              { Icon: Twitter, link: "https://x.com/Amaneditz6" },
              { Icon: Mail, link: "mailto:atanuaman25@gmail.com" }
            ].map(({ Icon, link }, i) => (
              <a
                key={i}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 md:p-4 sketch-border bg-white hover:bg-slate-800 hover:text-white transition-all transform hover:-rotate-6 hover:scale-110"
              >
                <Icon size={24} className="md:w-7 md:h-7" />
              </a>
            ))}
          </div>
          <div className="sketch-border bg-white p-6 md:p-10 transform rotate-1">
            <h3 className="text-2xl md:text-3xl font-bold mb-6">Drop a message</h3>

            {formStatus === "success" ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-green-100 border-2 border-green-800 p-6 rounded-xl text-center">
                <div className="text-5xl mb-2">🎉</div>
                <h4 className="text-2xl font-bold text-green-900">Message Sent!</h4>
                <p className="text-green-800 font-bold">Thanks for reaching out. I'll reply soon.</p>
                <button onClick={() => setFormStatus("idle")} className="mt-4 text-sm underline font-bold">Send another?</button>
              </motion.div>
            ) : (
              <form className="space-y-4 md:space-y-6 text-left" onSubmit={handleFormSubmit}>
                <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                  <input type="text" name="name" placeholder="Your Name" required className="w-full bg-slate-50 border-2 border-slate-800 p-3 md:p-4 text-lg md:text-xl font-bold placeholder-slate-400 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all" />
                  <input type="email" name="email" placeholder="Your Email" required className="w-full bg-slate-50 border-2 border-slate-800 p-3 md:p-4 text-lg md:text-xl font-bold placeholder-slate-400 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all" />
                </div>
                <textarea rows={4} name="message" placeholder="What's on your mind?" required className="w-full bg-slate-50 border-2 border-slate-800 p-3 md:p-4 text-lg md:text-xl font-bold placeholder-slate-400 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"></textarea>
                <button type="submit" disabled={formStatus === "submitting"} className="w-full py-3 md:py-4 bg-slate-800 text-white font-bold text-lg md:text-xl hover:bg-slate-900 shadow-[4px_4px_0px_0px_#fbbf24] hover:shadow-[2px_2px_0px_0px_#fbbf24] hover:translate-x-[2px] hover:translate-y-[2px] transition-all border-2 border-black disabled:opacity-50">
                  {formStatus === "submitting" ? "Sending..." : "Send it! 🚀"}
                </button>
                {formStatus === "error" && <p className="text-red-600 font-bold text-center">Oops! Something went wrong. Email me directly.</p>}
              </form>
            )}
          </div>
        </div>
      </section>
      <footer className="py-8 text-center text-slate-800 font-bold border-t-2 border-slate-800 bg-yellow-100">
        <p className="text-lg md:text-xl">Hand-crafted with❤️ by Aman</p>
        <p className="mt-2 text-sm opacity-70">© {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}