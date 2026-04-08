import { Layout } from "@/components/layout";
import { 
    useGetDiscordPresence, 
    useGetNowPlaying, 
    useGetTopArtists, 
    useGetSteamData, 
    useGetLastWorkout, 
    useGetStats 
} from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Github, Play, Activity, Gamepad2, Dumbbell, User, MapPin, Mail, Twitter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
    const { data: discord, isLoading: loadingDiscord } = useGetDiscordPresence();
    const { data: nowPlaying, isLoading: loadingMusic } = useGetNowPlaying();
    const { data: topArtists, isLoading: loadingArtists } = useGetTopArtists();
    const { data: steam, isLoading: loadingSteam } = useGetSteamData();
    const { data: workout, isLoading: loadingWorkout } = useGetLastWorkout();
    const { data: stats, isLoading: loadingStats } = useGetStats();

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    return (
        <Layout>
            <div className="container max-w-5xl mx-auto p-4 sm:p-8 flex-1">
                <motion.div 
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[minmax(150px,auto)]"
                >
                    {/* About Card - Span 2 cols */}
                    <motion.div variants={item} className="col-span-1 md:col-span-2 row-span-2">
                        <Card className="h-full bg-card hover:bg-card/80 transition-colors border-white/10 overflow-hidden relative group">
                            <CardContent className="p-6 sm:p-8 flex flex-col h-full justify-between z-10 relative">
                                <div>
                                    <div className="w-16 h-16 rounded-full bg-muted mb-4 overflow-hidden border border-white/10">
                                        <img src="https://api.dicebear.com/7.x/notionists/svg?seed=ana&backgroundColor=transparent" alt="Avatar" className="w-full h-full object-cover" />
                                    </div>
                                    <h2 className="text-2xl font-bold tracking-tight mb-2">Ana.</h2>
                                    <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-sm">
                                        Frontend engineer & designer crafting digital experiences. 
                                        Based in San Francisco. Building things that look good and feel right.
                                    </p>
                                </div>
                                <div className="flex gap-4 mt-6">
                                    <a href="#" className="text-muted-foreground hover:text-white transition-colors"><MapPin className="w-5 h-5" /></a>
                                    <a href="#" className="text-muted-foreground hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
                                    <a href="#" className="text-muted-foreground hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
                                    <a href="#" className="text-muted-foreground hover:text-white transition-colors"><Mail className="w-5 h-5" /></a>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Now Playing */}
                    <motion.div variants={item} className="col-span-1 md:col-span-2 lg:col-span-2">
                        <Card className="h-full bg-card border-white/10 overflow-hidden relative">
                            {nowPlaying?.albumArt && (
                                <div className="absolute inset-0 opacity-20 bg-cover bg-center blur-xl" style={{ backgroundImage: `url(${nowPlaying.albumArt})` }} />
                            )}
                            <CardContent className="p-6 flex items-center gap-6 h-full relative z-10">
                                {loadingMusic ? (
                                    <Skeleton className="w-full h-full" />
                                ) : (
                                    <>
                                        {nowPlaying?.albumArt ? (
                                            <div className="w-24 h-24 rounded-md overflow-hidden shrink-0 shadow-lg">
                                                <img src={nowPlaying.albumArt} alt="Album Art" className="w-full h-full object-cover" />
                                            </div>
                                        ) : (
                                            <div className="w-24 h-24 rounded-md bg-muted flex items-center justify-center shrink-0">
                                                <Play className="w-8 h-8 text-muted-foreground" />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                {nowPlaying?.isPlaying && (
                                                    <span className="flex gap-[2px] h-3 items-end">
                                                        <motion.span animate={{ height: [4, 12, 4] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1 bg-green-500 block" />
                                                        <motion.span animate={{ height: [8, 4, 8] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }} className="w-1 bg-green-500 block" />
                                                        <motion.span animate={{ height: [6, 10, 6] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }} className="w-1 bg-green-500 block" />
                                                    </span>
                                                )}
                                                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                                    {nowPlaying?.isPlaying ? "Now Playing" : "Last Played"}
                                                </span>
                                            </div>
                                            <h3 className="font-bold text-lg truncate">{nowPlaying?.track || "Not listening"}</h3>
                                            <p className="text-muted-foreground text-sm truncate">{nowPlaying?.artist || "—"}</p>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Discord Status */}
                    <motion.div variants={item} className="col-span-1">
                        <Card className="h-full bg-card border-white/10 p-6 flex flex-col justify-between">
                            {loadingDiscord ? (
                                <Skeleton className="w-full h-full" />
                            ) : (
                                <>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="relative">
                                            <div className="w-10 h-10 rounded-full bg-muted overflow-hidden">
                                                {discord?.avatarUrl && <img src={discord.avatarUrl} alt="Discord Avatar" className="w-full h-full" />}
                                            </div>
                                            <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card ${discord?.status === 'online' ? 'bg-green-500' : discord?.status === 'idle' ? 'bg-yellow-500' : discord?.status === 'dnd' ? 'bg-red-500' : 'bg-gray-500'}`} />
                                        </div>
                                        <div>
                                            <p className="font-medium leading-none">{discord?.displayName || "Discord"}</p>
                                            <p className="text-xs text-muted-foreground capitalize mt-1">{discord?.status || "Offline"}</p>
                                        </div>
                                    </div>
                                    {discord?.activity && (
                                        <div className="text-sm bg-black/40 p-3 rounded-lg border border-white/5">
                                            <p className="font-medium text-xs text-muted-foreground mb-1 uppercase">Playing</p>
                                            <p className="font-semibold truncate">{discord.activity}</p>
                                            {discord.activityDetail && <p className="text-xs text-muted-foreground truncate">{discord.activityDetail}</p>}
                                        </div>
                                    )}
                                </>
                            )}
                        </Card>
                    </motion.div>

                    {/* Top Artists */}
                    <motion.div variants={item} className="col-span-1 row-span-2">
                        <Card className="h-full bg-card border-white/10 p-6">
                            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <Play className="w-4 h-4" /> Top Artists
                            </h3>
                            {loadingArtists ? (
                                <div className="space-y-4"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></div>
                            ) : (
                                <div className="space-y-4">
                                    {topArtists?.slice(0, 5).map((artist, i) => (
                                        <a href={artist.url} target="_blank" rel="noreferrer" key={i} className="flex items-center justify-between group">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <span className="text-xs text-muted-foreground w-4">{i + 1}</span>
                                                {artist.imageUrl && (
                                                    <img src={artist.imageUrl} className="w-8 h-8 rounded-full object-cover" alt={artist.name} />
                                                )}
                                                <span className="font-medium text-sm truncate group-hover:text-primary transition-colors">{artist.name}</span>
                                            </div>
                                            <span className="text-xs text-muted-foreground shrink-0">{artist.playcount} plays</span>
                                        </a>
                                    ))}
                                </div>
                            )}
                        </Card>
                    </motion.div>

                    {/* GitHub Stats */}
                    <motion.div variants={item} className="col-span-1 md:col-span-2">
                        <Card className="h-full bg-card border-white/10 p-6">
                            {loadingStats ? (
                                <Skeleton className="w-full h-full" />
                            ) : (
                                <div className="flex flex-col h-full justify-between">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2 mb-1">
                                                <Github className="w-4 h-4" /> Contributions
                                            </h3>
                                            <p className="text-2xl font-bold">{stats?.totalCommitsThisYear || 0}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Current Streak</p>
                                            <p className="text-xl font-semibold text-green-500">{stats?.currentStreak || 0} days</p>
                                        </div>
                                    </div>
                                    
                                    {/* Languages Bar */}
                                    <div className="space-y-2">
                                        <div className="h-2 w-full rounded-full overflow-hidden flex">
                                            {stats?.topLanguages?.map((lang) => (
                                                <div key={lang.name} style={{ width: `${lang.percentage}%`, backgroundColor: lang.color }} className="h-full" />
                                            ))}
                                        </div>
                                        <div className="flex gap-4 text-xs text-muted-foreground">
                                            {stats?.topLanguages?.slice(0, 3).map((lang) => (
                                                <div key={lang.name} className="flex items-center gap-1.5">
                                                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: lang.color }} />
                                                    {lang.name}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Card>
                    </motion.div>

                    {/* Steam Stats */}
                    <motion.div variants={item} className="col-span-1 md:col-span-2">
                        <Card className="h-full bg-card border-white/10 p-6">
                            {loadingSteam ? (
                                <Skeleton className="w-full h-full" />
                            ) : (
                                <div className="flex flex-col h-full justify-between">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                            <Gamepad2 className="w-4 h-4" /> Steam Activity
                                        </h3>
                                        <span className="text-xs text-muted-foreground">{steam?.totalGames || 0} games</span>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        {steam?.recentGames?.slice(0, 2).map((game) => (
                                            <div key={game.appId} className="flex gap-3 items-center bg-black/30 p-2 rounded-lg border border-white/5">
                                                {game.imageUrl ? (
                                                    <img src={game.imageUrl} className="w-12 h-12 rounded object-cover" alt={game.name} />
                                                ) : (
                                                    <div className="w-12 h-12 rounded bg-muted flex items-center justify-center"><Gamepad2 className="w-5 h-5 text-muted-foreground" /></div>
                                                )}
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-sm truncate">{game.name}</p>
                                                    <p className="text-xs text-muted-foreground">{game.hoursPlayed} hrs</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </Card>
                    </motion.div>

                    {/* Workout Stats */}
                    <motion.div variants={item} className="col-span-1 md:col-span-2">
                        <Card className="h-full bg-card border-white/10 p-6">
                            {loadingWorkout ? (
                                <Skeleton className="w-full h-full" />
                            ) : (
                                <div className="flex flex-col h-full justify-between">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                            <Dumbbell className="w-4 h-4" /> Last Workout
                                        </h3>
                                        <span className="text-xs font-medium px-2 py-1 rounded bg-black/40 border border-white/5">{workout?.type || "Workout"}</span>
                                    </div>
                                    
                                    <div className="flex items-end gap-6">
                                        <div>
                                            <p className="text-3xl font-bold">{workout?.duration || 0}</p>
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Minutes</p>
                                        </div>
                                        <div>
                                            <p className="text-3xl font-bold">{workout?.totalVolume || 0}</p>
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Kg Lifted</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Card>
                    </motion.div>

                </motion.div>
            </div>
        </Layout>
    );
}
