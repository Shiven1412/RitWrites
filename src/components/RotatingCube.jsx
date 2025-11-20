import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import './RotatingCube.css';
import { Mail, Github, Linkedin, Twitter, Code, Palette, Zap, Instagram, SpellCheck, Pen, BookOpenText  } from 'lucide-react';

const faceRotations = {
  front: { x: -20, y: 30 },
  back: { x: -20, y: 210 },
  right: { x: -20, y: -60 },
  left: { x: -20, y: 120 },
  top: { x: -110, y: 30 },
  bottom: { x: 70, y: 30 },
};

export function RotatingCube({ profileImage }) {
  const [currentFace, setCurrentFace] = useState('front');
  const [rotation, setRotation] = useState({ x: -20, y: 30 });
  const [isHovering, setIsHovering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const hoverTimerRef = useRef(null);
  const hoverDirectionRef = useRef(null);
  const dragStartRef = useRef(null);
  const lastRotationRef = useRef({ x: -20, y: 30 });

  useEffect(() => {
    const targetRotation = faceRotations[currentFace];
    setRotation(targetRotation);
    lastRotationRef.current = targetRotation;
  }, [currentFace]);

  const handleMouseMove = (e) => {
    if (isDragging) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const deltaX = x - centerX;
    const deltaY = y - centerY;
    
    hoverDirectionRef.current = { x: deltaX, y: deltaY };
    
    const tiltX = -(deltaY / centerY) * 10;
    const tiltY = (deltaX / centerX) * 10;
    
    setRotation({
      x: faceRotations[currentFace].x + tiltX,
      y: faceRotations[currentFace].y + tiltY,
    });

    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
    }
    
    hoverTimerRef.current = setTimeout(() => {
      rotateToCubeFaceBasedOnDirection(deltaX, deltaY);
    }, 5000);
  };

  const rotateToCubeFaceBasedOnDirection = (deltaX, deltaY) => {
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    
    if (absX > absY) {
      if (deltaX > 0) {
        setCurrentFace('right');
      } else {
        setCurrentFace('left');
      }
    } else {
      if (deltaY > 0) {
        setCurrentFace('bottom');
      } else {
        setCurrentFace('top');
      }
    }
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
    }
    setRotation(faceRotations[currentFace]);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
    }
  };

  const handleMouseUp = (e) => {
    if (!isDragging || !dragStartRef.current) return;
    
    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;
    
    const threshold = 30;
    
    if (Math.abs(deltaX) > threshold || Math.abs(deltaY) > threshold) {
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);
      
      if (absX > absY) {
        if (deltaX > 0) {
          setCurrentFace('left');
        } else {
          setCurrentFace('right');
        }
      } else {
        if (deltaY > 0) {
          setCurrentFace('top');
        } else {
          setCurrentFace('bottom');
        }
      }
    }
    
    setIsDragging(false);
    dragStartRef.current = null;
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    const touch = e.touches[0];
    dragStartRef.current = { x: touch.clientX, y: touch.clientY };
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
    }
  };

  const handleTouchEnd = (e) => {
    if (!isDragging || !dragStartRef.current) return;
    
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - dragStartRef.current.x;
    const deltaY = touch.clientY - dragStartRef.current.y;
    
    const threshold = 30;
    
    if (Math.abs(deltaX) > threshold || Math.abs(deltaY) > threshold) {
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);
      
      if (absX > absY) {
        if (deltaX > 0) {
          setCurrentFace('left');
        } else {
          setCurrentFace('right');
        }
      } else {
        if (deltaY > 0) {
          setCurrentFace('top');
        } else {
          setCurrentFace('bottom');
        }
      }
    }
    
    setIsDragging(false);
    dragStartRef.current = null;
  };

  // cubeSize controls visual size; translateZ for faces should be half of this
  // Adding 2px overlap (320/2 - 2 = 158) to eliminate gaps between faces.
  const cubeSize = 320;
  const overlap = 2;
  const half = Math.round(cubeSize / 2) - overlap;

  return (
    <div
      className="rotating-cube-container"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <motion.div
        className="rotating-cube"
        animate={{
          rotateX: rotation.x,
          rotateY: rotation.y,
        }}
        transition={{ type: "spring", stiffness: 80, damping: 16, mass: 1 }}
        style={{
          transformStyle: "preserve-3d",
          width: `${cubeSize}px`,
          height: `${cubeSize}px`,
        }}
      >
        {/* Front Face - Profile Photo */}
        <div
          className="rotating-cube-face front-face"
          style={{
            transform: `translateZ(${half}px)`,
          }}
        >
          <img
            src={profileImage || ''}
            alt="Profile"
            className="cube-face-image"
          />
          <div className="cube-face-overlay">
            <div className="cube-face-text">
              <h3>Ritika Bisht</h3>
              <p>MA English — Content Writer</p>
            </div>
          </div>
        </div>

        {/* Back Face - Skills */}
        <div
          className="rotating-cube-face back-face"
          style={{
            transform: `translateZ(-${half}px) rotateY(180deg)`,
          }}
        >
          <h3>Skills</h3>
          <div className="cube-face-content">
            <SkillItem icon={<SpellCheck className="w-5 h-5" />} text="Proofreading" />
            <SkillItem icon={<BookOpenText className="w-5 h-5" />} text="Research" />
            <SkillItem icon={<Pen className="w-5 h-5" />} text="Content Writing" />
          </div>
        </div>

        {/* Right Face - About */}
        <div
          className="rotating-cube-face right-face"
          style={{
            transform: `rotateY(90deg) translateZ(${half}px)`,
          }}
        >
          <h3>About</h3>
          <p className="cube-face-text-content">
            Passionate about creating beautiful, interactive web experiences. 
            I blend design and code to bring ideas to life with modern technologies.
          </p>
        </div>

        {/* Left Face - Contact */}
        <div
          className="rotating-cube-face left-face"
          style={{
            transform: `rotateY(-90deg) translateZ(${half}px)`,
          }}
        >
          <h3>Contact</h3>
          <div className="cube-face-content">
            <ContactItem icon={<Mail className="w-5 h-5" />} text="ritwritesblog@gmail.com" />
            <ContactItem icon={<Instagram className="w-5 h-5" />} text="https://www.instagram.com/ritwrites" />
            <ContactItem icon={<Linkedin className="w-5 h-5" />} text="linkedin.com/in/ritika-bisht" />
          </div>
        </div>

        {/* Top Face */}
        <div
          className="rotating-cube-face top-face"
          style={{
            transform: `rotateX(90deg) translateZ(${half}px)`,
          }}
        >
          <div className="cube-face-center">
            <h3>Let's Connect!</h3>
            <div className="cube-face-icons">
              <Twitter className="w-6 h-6" />
              <Instagram className="w-6 h-6" />
              <Linkedin className="w-6 h-6" />
            </div>
          </div>
        </div>
        {/* Bottom Face */}
        <div
          className="rotating-cube-face bottom-face"
          style={{
            transform: `rotateX(-90deg) translateZ(${half}px)`,
          }}
        >
          <div className="cube-face-center">
            <p className="cube-face-quote">"Design is not just what it looks like, design is how it works."</p>
            <p className="cube-face-author">- Steve Jobs</p>
          </div>
        </div>
      </motion.div>
      
      {/* Face Indicator */}
      <div className="cube-face-indicator">
        {['front', 'right', 'back', 'left'].map((face) => (
          <button
            key={face}
            onClick={() => setCurrentFace(face)}
            className={`indicator-dot ${currentFace === face ? 'active' : ''}`}
          />
        ))}
      </div>
    </div>
  );
}

function SkillItem({ icon, text }) {
  return (
    <div className="skill-item">
      {icon}
      <span>{text}</span>
    </div>
  );
}

function ContactItem({ icon, text }) {
  return (
    <div className="contact-item">
      {icon}
      <span>{text}</span>
    </div>
  );
}