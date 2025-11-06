window.addEventListener('load', () => {

  // ===== Scroll fade-ins =====
  const scrollSections = document.querySelectorAll('.scroll-animate');
  const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
          if(entry.isIntersecting) entry.target.classList.add('visible');
      });
  }, { threshold: 0.2 });
  scrollSections.forEach(sec => observer.observe(sec));

  // Scroll fade-in for brand sections
const sections = document.querySelectorAll('.section');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.style.opacity = 1;
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.2 });

sections.forEach(sec => {
  sec.style.opacity = 0;
  sec.style.transform = 'translateY(30px)';
  sec.style.transition = 'opacity 0.8s, transform 0.8s';
  observer.observe(sec);
});

  // ===== Tangent lines for each section =====
  class TangentSection {
    constructor(section, hueRange=[140,180], lineCount=25) {
      this.section = section;
      this.canvas = section.querySelector('.section-bg-canvas');
      this.ctx = this.canvas.getContext('2d');
      this.hueRange = hueRange;
      this.lineCount = lineCount;
      this.lines = [];
      this.mouse = { x: this.canvas.width/2, y: this.canvas.height/2 };
      this.init();
      this.animate();
    }

    init() {
      this.resize();
      window.addEventListener('resize', ()=>this.resize());
      for(let i=0;i<this.lineCount;i++){
        this.lines.push({
          x: Math.random()*this.canvas.width,
          y: Math.random()*this.canvas.height,
          dx: (Math.random()-0.5)*1,
          dy: (Math.random()-0.5)*1,
          hue: this.hueRange[0] + Math.random()*(this.hueRange[1]-this.hueRange[0]),
        });
      }
    }

    resize() {
      this.canvas.width = this.section.offsetWidth;
      this.canvas.height = this.section.offsetHeight;
    }

    animate() {
      requestAnimationFrame(()=>this.animate());
      this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
      for(let line of this.lines){
        line.x += line.dx;
        line.y += line.dy;
        if(line.x<0||line.x>this.canvas.width) line.dx*=-1;
        if(line.y<0||line.y>this.canvas.height) line.dy*=-1;

        this.ctx.strokeStyle = `hsla(${line.hue},70%,60%,0.4)`;
        this.ctx.beginPath();
        this.ctx.moveTo(line.x,line.y);
        this.ctx.lineTo(line.x+line.dx*5,line.y+line.dy*5);
        this.ctx.stroke();
      }
    }
  }

  new TangentSection(document.querySelector('.hero'), [160,200]);
  new TangentSection(document.querySelector('#fullscent'), [10,340]); // fiery orange-magenta
  new TangentSection(document.querySelector('#frozenalchemy'), [160,180]); // green-teal
});
