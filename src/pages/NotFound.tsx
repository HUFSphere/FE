import { useNavigate } from 'react-router-dom'

function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-milk px-6 text-center">
      <p className="text-[120px] font-extrabold leading-none text-mocha">404</p>
      <h1 className="mt-6 text-4xl font-semibold text-charcoal">페이지를 찾을 수 없어요</h1>
      <p className="mt-3 text-lg text-taupe">
        주소가 잘못되었거나, 존재하지 않는 페이지예요.
      </p>
      <button
        onClick={() => navigate('/')}
        className="mt-9 rounded-xl border-2 border-mocha bg-taupe px-8 py-3 text-lg font-semibold text-milk"
      >
        홈으로 돌아가기
      </button>
    </div>
  )
}

export default NotFound