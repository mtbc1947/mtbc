import { useParams } from "react-router";

const RoyalShieldPage = () => {
  const params = useParams();
  const teamKey = params.teamKey;

  return (
    <div className=''>RoyalShieldPage {teamKey} </div>
  )
}

export default RoyalShieldPage