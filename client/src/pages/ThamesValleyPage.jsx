import { useParams } from "react-router";

const ThamesValleyPage = () => {

  const params = useParams();
  const teamKey = params.teamKey;

  return (
    <div className=''>ThamesValleyPage {teamKey}</div>
  )
}

export default ThamesValleyPage