import { MetaProps } from "../src/meta.ts";

export default function Meta({ metaProps }: { metaProps: MetaProps }) {
  const { description, title, url, keywords, imageUrl, type } = metaProps;
  return (
    <>
      {description
        ? (
          <>
            <meta name="description" content={description} />
            <meta property="og:description" content={description} />
          </>
        )
        : null}
      {title
        ? (
          <>
            <title>{title}</title>
            <meta property="og:title" content={title} />
          </>
        )
        : null}
      {keywords ? <meta name="keywords" content={keywords} /> : null}
      <meta property="og:url" content={url} />
      {type ? <meta property="og:type" content={type} /> : null}
      {imageUrl ? <meta property="og:image" content={imageUrl} /> : null}
    </>
  );
}
