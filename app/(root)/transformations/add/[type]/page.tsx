import Header from "@/components/shared/Header";
import Transformationform from "@/components/shared/Transformationform";
import { transformationTypes } from "@/constants";
import { getUserById } from "@/lib/actions/user.actions";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

type TransformationType = keyof typeof transformationTypes;

type SearchParamProps = {
  params: Promise<{
    type: TransformationType;
  }>;
};

const AddTransformationPage = async ({ params }: SearchParamProps) => {
  const resolvedParams = await params;
  const { type } = resolvedParams;
  const { userId } = await auth(); // لازم تعمل await هنا
  if (!userId) redirect("/sign-in");

  const user = await getUserById(userId); // هيرجع user بناءً على clerkId

  const transformation = transformationTypes[type];

  return (
    <>
      <Header title={transformation.title} subtitle={transformation.subTitle} />
      <section className="mt-10">
        <Transformationform
          action="Add"
          userId={user._id}
          type={transformation.type as TransformationType} // تأكد من النوع
          creditBalance={user.creditBalance}
        />
      </section>
    </>
  );
};

export default AddTransformationPage;
