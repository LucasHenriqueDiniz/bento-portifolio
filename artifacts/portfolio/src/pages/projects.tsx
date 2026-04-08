import { Layout } from "@/components/layout";
import GridMotion from "@/components/GridMotion";
import { useGetProjects } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export default function Projects() {
    const { data: projects, isLoading } = useGetProjects();

    const gridItems = projects ? projects.map(p => {
        if (p.imageUrl) return p.imageUrl;
        
        return (
            <div className="flex flex-col items-center justify-center p-6 text-center h-full w-full bg-black/80 backdrop-blur border border-white/10 rounded-xl hover:bg-black/60 transition-colors cursor-pointer">
                <h3 className="text-lg font-bold mb-2">{p.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-3">{p.description}</p>
                <div className="mt-4 flex gap-2 flex-wrap justify-center">
                    {p.tags.slice(0, 2).map(t => (
                        <span key={t} className="text-xs px-2 py-1 rounded-full bg-white/10">{t}</span>
                    ))}
                </div>
            </div>
        );
    }) : Array(28).fill("Loading...");

    return (
        <Layout>
            <div className="flex-1 relative bg-black overflow-hidden">
                {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Skeleton className="w-full h-full max-w-4xl max-h-screen opacity-10" />
                    </div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        transition={{ duration: 1 }}
                        className="w-full h-[calc(100vh-3.5rem)]"
                    >
                        <GridMotion items={gridItems} gradientColor="#1a1a1a" />
                        
                        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center z-10">
                            <div className="bg-background/80 backdrop-blur-md p-8 rounded-2xl border border-white/10 text-center shadow-2xl max-w-lg mx-4 pointer-events-auto">
                                <h1 className="text-4xl font-bold mb-4 tracking-tight">Selected Works</h1>
                                <p className="text-muted-foreground text-lg mb-6">
                                    A collection of projects, experiments, and open-source contributions. 
                                    Drag around to explore.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </Layout>
    );
}
