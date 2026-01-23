import placeHolderImage from '@/assets/placeHolderImage.png';

export default function Home() {
  return (
    <div>
      <div className="flex justify-center mb-5">
      <img src={placeHolderImage} alt="Dojo" className='h-60'/>
      </div>
      <h1 className="text-2xl font-bold mb-3">Mission:</h1>
      <p className="text-xl">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nobis dolorum cum ut, illum aperiam rerum sit cumque cupiditate maiores eveniet rem temporibus praesentium molestiae voluptatibus deserunt, autem optio dolore veritatis?</p>
      <h1 className="text-2xl font-bold mt-5 mb-3">News:</h1>
      <p className="text-xl">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nobis dolorum cum ut, illum aperiam rerum sit cumque cupiditate maiores eveniet rem temporibus praesentium molestiae voluptatibus deserunt, autem optio dolore veritatis?</p>
    </div>
  )
}
