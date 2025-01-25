import PageContent from "./pageContent";
export default async function Page({
  params,
}: {
  params: Promise<{ destinationUID: string }>,
}) {
  const uid = (await params).destinationUID;
  return <PageContent uid={uid} />
}