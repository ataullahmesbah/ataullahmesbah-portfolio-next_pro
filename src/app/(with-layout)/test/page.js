import Image from "next/image";

const TestPage = () => {
  return (
    <div className="bg-gray-800 p-10">
      <Image
        src='/brand.png'
        alt='Brand Logo'  
        width={250}
        height={100}
        className="your-class-name" 
        priority={false} 
      />
    </div>
  );
};

export default TestPage;