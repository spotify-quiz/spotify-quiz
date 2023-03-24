import { parseCookies } from 'nookies';
import Select from '../pages/select';

const SelectPage = ({ accessToken }: { accessToken: string }) => {
  return <Select accessToken={accessToken} />;
};

export const getServerSideProps = async (context) => {
  const { access_token } = parseCookies(context);

  return {
    props: {
      accessToken: access_token || null,
    },
  };
};

export default SelectPage;
