'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Users, MapPin, Mail, Phone, Heart } from 'lucide-react';

export default function AboutPage() {
  const teamMembers = [
    {
      name: '吴恒宇',
      role: '开发人员',
      expertise: '专注 AI 集成和前端技术',
      avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20developer%20portrait%2C%20asian%20male%2C%20modern%20office%20background%2C%20friendly%20smile&image_size=square'
    },
    {
      name: '邓芸蔓',
      role: '开发人员',
      expertise: '专注碳足迹计算和平台产品设计',
      avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20developer%20portrait%2C%20asian%20female%2C%20modern%20office%20background%2C%20friendly%20smile&image_size=square'
    },
    {
      name: '龙莉娟',
      role: '开发人员',
      expertise: '专注用户需求分析和环保政策研究',
      avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20developer%20portrait%2C%20asian%20female%2C%20modern%20office%20background%2C%20friendly%20smile&image_size=square'
    }
  ];

  return (
    <div className="container py-12 px-4 md:px-6 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <Leaf className="h-8 w-8 text-primary mr-2" />
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">关于我们</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          我们是一支致力于环保科技的团队，通过创新技术帮助人们减少碳足迹，推动可持续发展。
        </p>
      </div>

      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6 text-center">我们的使命</h2>
        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/30 dark:to-blue-950/30 rounded-lg p-8 border border-green-100 dark:border-green-900/30">
          <p className="text-muted-foreground leading-relaxed text-center">
            我们的使命是通过科技手段，让环保行为变得简单易行，
            帮助每个人理解并减少自己的碳足迹，
            共同创造一个更加可持续的未来。
          </p>
        </div>
      </section>

      <section className="mb-16">
        <div className="flex items-center justify-center mb-6">
          <Users className="h-6 w-6 text-primary mr-2" />
          <h2 className="text-2xl font-semibold">团队成员</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {teamMembers.map((member, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-48 bg-muted flex items-center justify-center">
                <img 
                  src={member.avatar} 
                  alt={member.name} 
                  className="h-full w-full object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle>{member.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium mb-2">{member.role}</p>
                <p className="text-sm text-muted-foreground">{member.expertise}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <div className="flex items-center justify-center mb-6">
          <Heart className="h-6 w-6 text-primary mr-2" />
          <h2 className="text-2xl font-semibold">我们的价值观</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-green-50 to-white dark:from-green-950/30 dark:to-slate-900">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3">创新</h3>
              <p className="text-sm text-muted-foreground">
                不断探索新的技术和方法，为环保问题提供创新解决方案。
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/30 dark:to-slate-900">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3">可持续</h3>
              <p className="text-sm text-muted-foreground">
                我们的产品和服务本身也遵循可持续发展原则，减少环境影响。
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/30 dark:to-slate-900">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3">协作</h3>
              <p className="text-sm text-muted-foreground">
                与用户、合作伙伴和环保组织紧密合作，共同推动环保事业。
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-center mb-6">
          <MapPin className="h-6 w-6 text-primary mr-2" />
          <h2 className="text-2xl font-semibold">联系我们</h2>
        </div>
        <div className="bg-muted/30 rounded-lg p-8 border border-muted">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-medium mb-1">地址</h3>
                <p className="text-sm text-muted-foreground">四川省成都市都江堰市青城山市</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-medium mb-1">邮箱</h3>
                <a href="mailto:2060432613@qq.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">2060432613@qq.com</a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-medium mb-1">电话</h3>
                <a href="tel:13219082202" className="text-sm text-muted-foreground hover:text-primary transition-colors">13219082202</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
