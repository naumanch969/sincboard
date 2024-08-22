import Head from "next/head";

export const PageTitle = ({ title, description, link }: { title: string, description: string, link: string }) => (
    <>
        <Head>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            {/* <meta name="twitter:card" content="summary_large_image" /> */}
            {link && <link rel="canonical" href={link} />}
        </Head>
    </>
);
