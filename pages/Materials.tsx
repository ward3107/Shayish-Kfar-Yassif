import React from 'react';

const Materials: React.FC = () => {
  return (
    <div className="pt-32 pb-20 bg-primary min-h-screen text-light transition-colors duration-300">
      <div className="container mx-auto px-6">
        <div className="mb-24 text-center">
          <h1 className="text-5xl md:text-7xl font-serif text-light mb-6">Materiality</h1>
          <p className="text-muted font-light max-w-2xl mx-auto">
            The soul of a home lies in the materials. We source the world's finest ceramics, porcelain, and natural stones.
          </p>
        </div>

        {/* Section 1: Stone */}
        <div className="mb-32">
            <div className="flex items-end justify-between border-b border-neutral-800 pb-4 mb-12">
                <h2 className="text-3xl font-serif">Porcelain & Stone</h2>
                <span className="text-accent text-xs uppercase tracking-widest">01</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
                 <div className="bg-secondary p-12 hover:bg-surface transition-colors border border-neutral-900/50">
                     <h3 className="font-serif text-2xl mb-4 text-light">Porcelain & Ceramic</h3>
                     <p className="text-muted text-sm font-light leading-relaxed">Ultra-compact surfaces perfect for modern kitchens. Heat resistant, scratch resistant, and available in stunning designs.</p>
                 </div>
                 <div className="bg-secondary p-12 hover:bg-surface transition-colors border border-neutral-900/50">
                     <h3 className="font-serif text-2xl mb-4 text-light">Caesarstone</h3>
                     <p className="text-muted text-sm font-light leading-relaxed">The Israeli standard for quartz surfaces. Durable, practical, and beautiful for everyday use.</p>
                 </div>
                 <div className="bg-secondary p-12 hover:bg-surface transition-colors border border-neutral-900/50">
                     <h3 className="font-serif text-2xl mb-4 text-light">Natural Marble</h3>
                     <p className="text-muted text-sm font-light leading-relaxed">Timeless beauty sourced from Italy and Greece. For those who appreciate the unique imperfections and character of nature.</p>
                 </div>
            </div>
        </div>

        {/* Section 2: Finishes */}
        <div className="mb-32">
            <div className="flex items-end justify-between border-b border-neutral-800 pb-4 mb-12">
                <h2 className="text-3xl font-serif">Surface Finishes</h2>
                <span className="text-accent text-xs uppercase tracking-widest">02</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    { title: "Polished", desc: "Classic high-gloss shine reflecting light.", img: "https://picsum.photos/seed/m1/400/300" },
                    { title: "Matte / Silk", desc: "Smooth, non-reflective, soft touch.", img: "https://picsum.photos/seed/m2/400/300" },
                    { title: "Concrete", desc: "Industrial textured look and feel.", img: "https://picsum.photos/seed/m3/400/300" },
                    { title: "Rough", desc: "Natural stone texture with grip.", img: "https://picsum.photos/seed/m4/400/300" }
                ].map((item, i) => (
                    <div key={i} className="group cursor-pointer">
                        <div className="overflow-hidden aspect-[4/5] mb-6 grayscale group-hover:grayscale-0 transition-all duration-500">
                            <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform group-hover:scale-110"/>
                        </div>
                        <h3 className="font-serif text-xl mb-2 text-light group-hover:text-accent transition-colors">{item.title}</h3>
                        <p className="text-muted text-xs tracking-wide">{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Materials;