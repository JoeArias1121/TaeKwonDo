import avatar from "@/assets/avatar.jpg";

export default function AboutMe() {
  return (
    <div className="flex flex-col gap-5 items-center">
      <img
        src={avatar}
        alt="Avatar"
        className="rounded-full w-32 md:w-48 lg:w-64"
      />
      <p className="text-center text-2xl">
        Hi, I'm Grand Master Ramon. I am Lorem ipsum dolor, sit amet consectetur
        adipisicing elit. Totam, quam possimus blanditiis dolore quo similique
        beatae magni adipisci laboriosam deleniti, non odio ipsam excepturi
        soluta. Fugiat est cumque et fuga!
      </p>
    </div>
  );
}
