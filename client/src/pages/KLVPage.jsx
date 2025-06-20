import { useParams } from "react-router";

const KLVPage = () => {
  let params = useParams();
  const teamKey = params.teamKey;

  return (
    <div className=''>KLVPage {teamKey}</div>
  )
}

export default KLVPage