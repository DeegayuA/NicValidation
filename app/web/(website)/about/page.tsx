"use client";

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { HandHeart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from "next/image";
import { useSettings } from '@/components/settings-provider';
import { useState } from 'react';
import { Lens } from '@/components/ui/lens';
import { motion } from 'framer-motion';
import chroma from 'chroma-js';

export default function AboutPage() {
  const { fontSize, accentColor } = useSettings();
  const [hovering, setHovering] = useState(false);

  // Helper functions to adjust the color
  function darkenAccentColor(color: string) {
    return chroma(color).darken(1).hex(); // Darken the color by 1
  }

  function lightenAccentColor(color: string) {
    return chroma(color).brighten(1).hex(); // Lighten the color by 1
  }

  return (
    <main className="bg-background p-6 mt-[2rem] md:mt-[4rem]" style={{ fontSize: `${fontSize / 16}rem` }}>
    <div className="max-w-2xl mx-auto">
      <Button asChild variant="ghost" className="mb-8">
        <Link href="/web/public">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </Button>

      <Card className="p-8 text-center space-y-8">
          <HandHeart className="mt-8 w-12 h-12 mx-auto text-primary" />
          <h1
            className="px-8 text-3xl font-bold text-primary"
            style={{ fontSize: `${fontSize / 16 * 2}rem` }}
          >
            About Us
          </h1>
          <p
            className="px-8 text-lg text-justify text-primary"
            style={{ fontSize: `${fontSize / 16 * 0.875}rem` }}
          >
            Welcome to LifeSight, an innovative AI-powered web application designed to empower visually impaired individuals to navigate their world with ease, independence, and confidence. Our mission is to bridge the accessibility gap and provide real-time assistance to those who need it the most, enabling them to carry out everyday tasks without dependency on others.
          </p>

          <h2
            className="px-8 text-lg font-bold text-primary"
            style={{ fontSize: `${fontSize / 16 * 1.5}rem` }}
          >
            Our Vision
          </h2>
          <p
            className="px-8 text-lg text-justify text-primary"
            style={{ fontSize: `${fontSize / 16 * 0.875}rem` }}
          >
            At <b>LifeSight</b>, we believe in a world where everyone, regardless of visual impairments, can explore, engage, and thrive independently. We envision a future where advanced AI solutions not only help individuals perform tasks but also enhance their daily experiences by providing real-time, contextual guidance that is easy to use and adapt to various environments.
          </p>
          <div>
            <div
              className="w-full relative rounded-lg overflow-hidden mx-auto mt-4"
              style={{
                background: `linear-gradient(to right, ${accentColor}, ${
                  document.documentElement.classList.contains('dark')
                    ? `${darkenAccentColor(accentColor)}`
                    : `${lightenAccentColor(accentColor)}`
                  })`,
              }}
            >
              <h2
                className="text-2xl font-bold text-primary mt-6"
                style={{ fontSize: `${fontSize / 16 * 1.5}rem` }}
              >
                Our Team
              </h2>
              <p
                className="px-8 text-justify mt-4 text-primary"
                style={{ fontSize: `${fontSize / 16 * 0.875}rem` }}
              >
                <b>We are the team of LifeSight</b>. It was developed to fulfill a requirement to complete the <b>Master of Information Technology (MsIT) program, 2024</b> (<b>Group 5</b>) from the <b>University of Kelaniya, Sri Lanka</b>. This project aims to bridge the gap between cutting-edge technologies and practical solutions for real-world challenges. As part of our development process, we focused on integrating innovative approaches to ensure that LifeSight not only meets the academic requirements but also stands as a meaningful contribution to the field of technology.

                <br /><br /> 
                Thank you for using LifeSight. We hope you find it helpful and easy to use. If you have any feedback or suggestions, please feel free to reach out to us. We are always looking for ways to improve and enhance the user experience.
                </p>
              <div className="p-8 pt-4 relative z-10">
                <Lens hovering={hovering} setHovering={setHovering}>
                  <Image
                    src="/images/LifeSightTeam.jpg"
                    alt="LifeSight Team"
                    width={800}
                    height={800}
                    className="rounded-lg"
                  />
                </Lens>
                <motion.div
                  animate={{
                    filter: hovering ? "blur(2px)" : "blur(0px)",
                  }}
                  className="relative z-20"
                >

                </motion.div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
