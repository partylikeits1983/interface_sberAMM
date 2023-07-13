import ChallengeForm from './form';

export default function Page() {
  return (
    <div className="flex justify-center">
      <div className="prose prose-sm prose-invert max-w-none space-y-9">
        <h1 className="text-xl font-bold">Deposit Liquidity</h1>

        <ChallengeForm />
      </div>
    </div>
  );
}
