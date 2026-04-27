type Props = {
  title?: string;
};

export default function Header({ title }: Props) {
  return (
    <div className="bg-blue-700 text-white p-4 text-center">
      <h1 className="text-lg font-bold">
        Student Result Portal
      </h1>
      
      {title && (
        <p className="mt-2 text-sm font-medium">
          {title}
        </p>
      )}
    </div>
  );
}