/* eslint-disable @typescript-eslint/no-explicit-any */
import CarService from '@/lib/services/car-service';
import Image from 'next/image';
import { Zap, Shield, Rocket, Target } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description:
      'Blazing fast performance with optimized infrastructure and zero latency',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description:
      'Bank-grade encryption and compliance with international security standards',
  },
  {
    icon: Rocket,
    title: 'Scalable Growth',
    description: 'Seamlessly scale from startup to enterprise without any limitations',
  },
  {
    icon: Target,
    title: 'Precision Focused',
    description: 'Laser-focused solutions with detailed analytics and deep insights',
  },
  // {
  //   icon: Lightbulb,
  //   title: 'Innovation First',
  //   description: 'Cutting-edge technology and creative problem-solving for your business',
  // },
  // {
  //   icon: BarChart3,
  //   title: 'Advanced Analytics',
  //   description:
  //     'Comprehensive reporting and powerful dashboards for data-driven decisions',
  // },
];

export default async function Home() {
  const response = await CarService.getAllCars();

  return (
    <div>
      <div className="relative">
        <Image
          src="/images/bg-1.png"
          width={1000}
          height={50}
          alt=""
          className="w-full"
        />
        <p className="w-full text-center font-bold text-2xl md:text-6xl text-white absolute bottom-10 md:bottom-20">
          Lorem ipsum dolor sit
        </p>
      </div>

      <div className="p-4 md:p-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mt-10 mb-4 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              Features of Us
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              We provide the best services and tools to help you achieve your goals with
              speed and efficiency
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-linear-to-br from-primary/0 to-primary/0 transition-all duration-300" />

                  <div className="relative z-10">
                    <div className="mb-6 inline-flex rounded-xl bg-gray-200 p-4 transition-all duration-300">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>

                    <h3 className="mb-3 text-xl font-semibold text-foreground transition-colors">
                      {feature.title}
                    </h3>

                    <p className="text-sm leading-relaxed text-muted-foreground transition-colors">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <h1 className="mt-24 mb-12 text-center font-bold text-2xl md:text-3xl px-4">
          Latest inventory information
        </h1>

        {response && response.status == 200 && (
          <div className="mx-auto max-w-7xl">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {response.data.map((x: any, index: number) => (
                <div
                  key={index}
                  className="rounded-2xl shadow-[0px_7px_29px_0px_rgba(100,100,111,0.2)]"
                >
                  <Image
                    src={`${process.env.ASSETS_URL}/${index + 1}.jpg`}
                    width={200}
                    height={200}
                    alt=""
                    className="rounded-t-2xl w-full"
                  />
                  <div className="p-5 space-y-2">
                    <p>
                      {x.modelName} {x.year}
                    </p>
                    <p>{x.colorName}</p>
                    <p>{x.mileage} mile</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
