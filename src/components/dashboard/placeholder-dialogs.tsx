'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Activity, Footprints, Moon, Flame, Mail, Inbox, Send, Cloud, Sun, CloudRain, Wind, Droplets, FolderKanban, CheckCircle2, Clock } from 'lucide-react';

// 건강 관리 (HEALTH)
export function HealthDialog() {
    const healthData = [
        { icon: Footprints, label: '걸음 수', value: '8,234', goal: '10,000', color: 'text-blue-600', bgColor: 'bg-blue-100' },
        { icon: Moon, label: '수면 시간', value: '7.5시간', goal: '8시간', color: 'text-purple-600', bgColor: 'bg-purple-100' },
        { icon: Flame, label: '칼로리', value: '1,850', goal: '2,000', color: 'text-orange-600', bgColor: 'bg-orange-100' },
        { icon: Activity, label: '심박수', value: '72 bpm', goal: '정상', color: 'text-red-600', bgColor: 'bg-red-100' },
    ];

    return (
        <div className="grid grid-cols-2 gap-4">
            {healthData.map((item, index) => (
                <Card key={index}>
                    <CardHeader className="pb-3">
                        <div className={`w-12 h-12 rounded-full ${item.bgColor} flex items-center justify-center mb-2`}>
                            <item.icon className={`h-6 w-6 ${item.color}`} />
                        </div>
                        <CardTitle className="text-sm font-medium">{item.label}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{item.value}</div>
                        <p className="text-xs text-muted-foreground mt-1">목표: {item.goal}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

// 메일함 (MAIL)
export function MailDialog() {
    const emails = [
        { id: 1, from: '김철수', subject: '프로젝트 진행 상황 공유', time: '10분 전', unread: true },
        { id: 2, from: '이영희', subject: '회의록 검토 요청', time: '1시간 전', unread: true },
        { id: 3, from: '박민수', subject: 'Re: 다음 주 일정 조율', time: '2시간 전', unread: false },
        { id: 4, from: '정수진', subject: '분기 보고서 제출', time: '어제', unread: false },
    ];

    const unreadCount = emails.filter(e => e.unread).length;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold">받은 편지함</h3>
                    <p className="text-sm text-muted-foreground">안 읽은 메일 {unreadCount}개</p>
                </div>
                <div className="flex gap-2">
                    <Badge variant="outline" className="gap-1">
                        <Inbox className="h-3 w-3" />
                        {emails.length}
                    </Badge>
                </div>
            </div>
            <div className="space-y-2">
                {emails.map((email) => (
                    <Card key={email.id} className={email.unread ? 'border-primary' : ''}>
                        <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <Mail className={`h-4 w-4 ${email.unread ? 'text-primary' : 'text-muted-foreground'}`} />
                                        <span className={`font-medium ${email.unread ? 'text-primary' : ''}`}>{email.from}</span>
                                        {email.unread && <Badge variant="default" className="h-5 text-xs">New</Badge>}
                                    </div>
                                    <p className="text-sm mt-1">{email.subject}</p>
                                </div>
                                <span className="text-xs text-muted-foreground">{email.time}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

// 날씨 정보 (WEATHER)
export function WeatherDialog() {
    const forecast = [
        { day: '월', icon: Sun, temp: '24°', condition: '맑음' },
        { day: '화', icon: Cloud, temp: '22°', condition: '구름' },
        { day: '수', icon: CloudRain, temp: '18°', condition: '비' },
        { day: '목', icon: Cloud, temp: '20°', condition: '구름' },
        { day: '금', icon: Sun, temp: '25°', condition: '맑음' },
    ];

    return (
        <div className="space-y-6">
            <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                    <Sun className="h-24 w-24 text-yellow-500" />
                </div>
                <h2 className="text-6xl font-bold">24°C</h2>
                <p className="text-xl text-muted-foreground mt-2">맑음</p>
                <p className="text-sm text-muted-foreground">서울, 대한민국</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-4 text-center">
                        <Droplets className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                        <p className="text-sm text-muted-foreground">습도</p>
                        <p className="text-lg font-semibold">65%</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <Wind className="h-6 w-6 mx-auto mb-2 text-gray-500" />
                        <p className="text-sm text-muted-foreground">바람</p>
                        <p className="text-lg font-semibold">12 km/h</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <CloudRain className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                        <p className="text-sm text-muted-foreground">강수</p>
                        <p className="text-lg font-semibold">10%</p>
                    </CardContent>
                </Card>
            </div>

            <div>
                <h3 className="font-semibold mb-3">주간 예보</h3>
                <div className="grid grid-cols-5 gap-2">
                    {forecast.map((day, index) => (
                        <Card key={index}>
                            <CardContent className="p-3 text-center">
                                <p className="text-sm font-medium mb-2">{day.day}</p>
                                <day.icon className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                                <p className="text-lg font-semibold">{day.temp}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}

// 프로젝트 관리 (PROJECT)
export function ProjectDialog() {
    const projects = [
        { id: 1, name: '웹사이트 리뉴얼', progress: 75, status: '진행중', tasks: '12/16', color: 'bg-blue-500' },
        { id: 2, name: '모바일 앱 개발', progress: 45, status: '진행중', tasks: '8/18', color: 'bg-green-500' },
        { id: 3, name: 'AI 챗봇 구현', progress: 90, status: '검토중', tasks: '15/17', color: 'bg-purple-500' },
    ];

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold">프로젝트 현황</h3>
                    <p className="text-sm text-muted-foreground">총 {projects.length}개 프로젝트</p>
                </div>
                <Badge variant="outline" className="gap-1">
                    <FolderKanban className="h-3 w-3" />
                    {projects.length}
                </Badge>
            </div>

            <div className="space-y-3">
                {projects.map((project) => (
                    <Card key={project.id}>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base">{project.name}</CardTitle>
                                <Badge variant={project.status === '진행중' ? 'default' : 'secondary'}>
                                    {project.status}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <div className="flex items-center justify-between text-sm mb-2">
                                    <span className="text-muted-foreground">진행률</span>
                                    <span className="font-semibold">{project.progress}%</span>
                                </div>
                                <Progress value={project.progress} className="h-2" />
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-1 text-muted-foreground">
                                    <CheckCircle2 className="h-4 w-4" />
                                    <span>완료된 작업</span>
                                </div>
                                <span className="font-medium">{project.tasks}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
