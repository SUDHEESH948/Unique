This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Our Process construction animation

From the existing Next.js project directory:

```sh
npm ci
npm run dev
```

Open the home page and choose **Process** in the site navigation. Scroll down to assemble the residence and back up to reverse it. To check a production build, run `npm run build`, then `npm start`.

For an existing App Router project that needs the section dependencies:

```sh
npm install three @react-three/fiber @react-three/drei gsap @fontsource-variable/cormorant-garamond @fontsource-variable/manrope
npm install -D @types/three
```

The implementation lives in `app/components/construction`. `ConstructionTimeline.ts` owns the scroll pin and playhead. `constructionStages.ts` supplies the labels. `HouseModel.tsx` defines staged geometry, offsets, and piece timings. `ConstructionScene.tsx` handles the camera, environment, and shadows. Tailwind handles the overlay layout, and `component5.css` contains section-specific styling.

### Replacing the procedural house with a Blender model

1. Use meters in Blender and apply rotation and scale. Prepare the project for a Three.js Y-up scene with the front facing positive Z after export. Keep the finished building centered around the origin and the site surface at Y = 0.
2. Create separate objects or parent empties for footings, slabs, ground-floor and upper-floor columns, individual beams, wall panels, roof framing and panels, window and door assemblies, cladding, balcony railings, trees, and luminaires. Give each installable piece a unique name. Set origins at practical installation pivots, such as the base of a rising column.
3. Assign glTF-compatible PBR materials. Pack or bake material maps, reuse materials across repeated objects, and size textures for the on-screen footprint. Export the selected set via **File → Export → glTF 2.0**, choose **glTF Binary (.glb)**, enable **+Y Up**, and save as `public/models/luxury-house.glb`.
4. Inside the dynamically loaded scene, load the file with Drei's `useGLTF("/models/luxury-house.glb")`. Map exported object names into the installation batches in `HouseModel.tsx`. Swap each procedural mesh for its matching GLB node, cloned before changing its transform. Keep each exported world transform as the settled pose, and apply scroll offsets and scale to a pivot wrapper. Update step ranges or camera framing if the new geometry differs from the demonstration house.
5. Check the assembled pose and scrub forward and backward in the browser. Confirm that off-screen geometry, material transparency, and shadows behave as expected on phones. If enabling Draco or Meshopt compression, configure the loader with the matching decoder and test the shipped GLB.

The demonstration model loads near the viewport and renders on demand. It uses a generated low-resolution lighting environment and capped device pixel ratio. When replacing it, start with simplified landscaping and glazing, reuse hardware meshes, instance large groups of static repeats, and profile GPU time before increasing shadow resolution or adding postprocessing. Reduced-motion visitors get a stationary completed view and a readable list of stages.
