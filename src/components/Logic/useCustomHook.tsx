import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userSlice } from "../store/userSlice";
import { searcPublicationsSlice } from "../store/searcPublicationsSlice";
import dateformat from "dateformat";
type userInfo = {
  login: string;
  password: string;
};

type TypeSearchParams = {
  reason: boolean;
  mentions: boolean;
  mainRole: boolean;
  publicWithRisk: boolean;
  turnOnNews: boolean;
  turnOnCalendars: boolean;
  turnOnReports: boolean;
  INNOfCompany: string;
  tonal: string;
  tonalSelectVision: boolean;
  countOfDocumentsInOut: string;
  searchRange: {
    start: string;
    end: string;
  };
  typeOfInputsStart: string | number;
  typeOfInputsEnd: string | number;
};

const useCustomHook = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userLoged: boolean = useSelector((state: any) => state.user.userLoged)
  const documentsPublications = useSelector(
    (state: any) => state.publications.documetsPublications
  );
  const dataHistograms = useSelector(
    (state: any) => state.publications.dataHistograms
  );
  const [count, setCount] = useState(0);

  const [userInfo, setUserInfo] = useState<userInfo>({
    login: "sf_student10",
    password: "KHKfTXb",
  });

  const [loaderUserAccount, setLoaderUserAccount] = useState(false);
  const [loaderPublications, setLoaderPublications] = useState(false);


  const tokenInLocalStorage = localStorage.getItem("token");

  useEffect(() => {
    if (tokenInLocalStorage && !userLoged) {
      try {
        logInWithToken(tokenInLocalStorage);
      } catch (err) {
        navigate("login");
        console.log(err);
      }
    }
  }, []);

  useEffect(() => {
    if (documentsPublications !== null && dataHistograms) {
      if (dataHistograms.data.length === 0) {
        return;
      }
      const dataHistogramsDate = dataHistograms.data[0].data;
      const dataRisksDate = dataHistograms.data[1].data;
      const sortDataHistogramsByDate = [...dataHistogramsDate].sort((a, b) =>
        a.date > b.date ? 1 : -1
      );
      const sortDataRisksDateByDate = [...dataRisksDate].sort((a, b) =>
        a.date > b.date ? 1 : -1
      );
      const sortDataHistograms = sortDataHistogramsByDate.map((el) => {
        return {
          date: dateformat(new Date(el.date), "dd/mm/yyyy").replace(
            /[/]+/g,
            "."
          ),
          value: el.value,
        };
      });

      const sortDataRisksDates = sortDataRisksDateByDate.map((el) => {
        return {
          date: dateformat(new Date(el.date), "dd/mm/yyyy").replace(
            /[/]+/g,
            "."
          ),
          value: el.value,
        };
      });

      dispatch(
        searcPublicationsSlice.actions.setSortedDatesForDataHistograms({
          sortDataHistograms,
          sortDataRisksDates,
        })
      );
    }
  }, [documentsPublications, dataHistograms]);
  const logInWithToken = async (token: string) => {
    setLoaderUserAccount(true);
    const res = await fetch(
      "https://gateway.scan-interfax.ru/api/v1/account/info",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.ok) {
      const accountInfo = await res.json();
      dispatch(userSlice.actions.setUser(accountInfo));
      setLoaderUserAccount(false);
      navigate("/");
    } else {
      localStorage.clear()
      dispatch(userSlice.actions.clearUser());
      setLoaderUserAccount(false);
    }
  };

  const logInAccountHandleClick = async (user: userInfo): Promise<any> => {
    setLoaderUserAccount(true);
    const res = await fetch(
      "https://gateway.scan-interfax.ru/api/v1/account/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      }
    );
    if (res.ok) {
      const token = (await res.json()).accessToken;
      localStorage.setItem("token", token);

      const response = await fetch(
        "https://gateway.scan-interfax.ru/api/v1/account/info",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.ok) {
        const accountInfo = await response.json();
        dispatch(userSlice.actions.setUser(accountInfo));
        setLoaderUserAccount(false);
        navigate("/");
      } else {
        setLoaderUserAccount(false);
      }
    } else {
      setLoaderUserAccount(false);
      setUserInfo(() => ({login: "", password: ""}))
    }



  };
  const searchHandleClick = async (searchParams: TypeSearchParams) => {
    setLoaderPublications(true);
    navigate("/results");
    try {
      const res = await fetch(
        "https://gateway.scan-interfax.ru/api/v1/objectsearch/histograms",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${tokenInLocalStorage}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            issueDateInterval: {
              startDate: `${searchParams.searchRange.start}T00:00:00+03:00`,
              endDate: `${searchParams.searchRange.end}T23:59:59+03:00`,
            },
            searchContext: {
              targetSearchEntitiesContext: {
                targetSearchEntities: [
                  {
                    type: "company",
                    sparkId: null,
                    entityId: null,
                    inn: searchParams.INNOfCompany,
                    maxFullness: searchParams.reason,
                    inBusinessNews: searchParams.mentions,
                  },
                ],
                onlyMainRole: searchParams.mainRole,
                tonality: "any",
                onlyWithRiskFactors: searchParams.publicWithRisk,
                riskFactors: {
                  and: [],
                  or: [],
                  not: [],
                },
                themes: {
                  and: [],
                  or: [],
                  not: [],
                },
              },
              themesFilter: {
                and: [],
                or: [],
                not: [],
              },
            },
            searchArea: {
              includedSources: [],
              excludedSources: [],
              includedSourceGroups: [],
              excludedSourceGroups: [],
            },
            attributeFilters: {
              excludeTechNews: searchParams.turnOnNews,
              excludeAnnouncements: searchParams.turnOnCalendars,
              excludeDigests: searchParams.turnOnReports,
            },
            similarMode: "duplicates",
            limit: Number(searchParams.countOfDocumentsInOut),
            sortType: "sourceInfluence",
            sortDirectionType: "desc",
            intervalType: "month",
            histogramTypes: ["totalDocuments", "riskFactors"],
          }),
        }
      );
      const result = await res.json();

      if (result.data.length === 0) {
        dispatch(searcPublicationsSlice.actions.setDataHistograms(false));
        setLoaderPublications(false);
        return;
      } else {
        objectSearch(searchParams);
        dispatch(searcPublicationsSlice.actions.setDataHistograms(result));
      }
    } catch (err) {
      setLoaderPublications(false);
      console.log(err);
    }
  };
  const objectSearch = async (searchParams: TypeSearchParams) => {
    try {
      const res = await fetch(
        "https://gateway.scan-interfax.ru/api/v1/objectsearch",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${tokenInLocalStorage}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            issueDateInterval: {
              startDate: `${searchParams.searchRange.start}T00:00:00+03:00`,
              endDate: `${searchParams.searchRange.end}T23:59:59+03:00`,
            },
            searchContext: {
              targetSearchEntitiesContext: {
                targetSearchEntities: [
                  {
                    type: "company",
                    sparkId: null,
                    entityId: null,
                    inn: searchParams.INNOfCompany,
                    maxFullness: searchParams.reason,
                    inBusinessNews: searchParams.mentions,
                  },
                ],
                onlyMainRole: searchParams.mainRole,
                tonality: "any",
                onlyWithRiskFactors: searchParams.publicWithRisk,
                riskFactors: {
                  and: [],
                  or: [],
                  not: [],
                },
                themes: {
                  and: [],
                  or: [],
                  not: [],
                },
              },
              themesFilter: {
                and: [],
                or: [],
                not: [],
              },
            },
            searchArea: {
              includedSources: [],
              excludedSources: [],
              includedSourceGroups: [],
              excludedSourceGroups: [],
            },
            attributeFilters: {
              excludeTechNews: searchParams.turnOnNews,
              excludeAnnouncements: searchParams.turnOnCalendars,
              excludeDigests: searchParams.turnOnReports,
            },
            similarMode: "duplicates",
            limit: Number(searchParams.countOfDocumentsInOut),
            sortType: "sourceInfluence",
            sortDirectionType: "desc",
            intervalType: "month",
            histogramTypes: ["totalDocuments", "riskFactors"],
          }),
        }
      );
      const result = await res.json();

      const arrIdsOfPublications = result.items.map((el: any) => {
        return el.encodedId;
      });
      let arrIdsOfPublicationsByPart = [];
      const x = arrIdsOfPublications.length / 10;
      const size = 10;
      for (let i = 0; i < Math.ceil(x); i++) {
        arrIdsOfPublicationsByPart[i] = arrIdsOfPublications.slice(
          i * size,
          i * size + size
        );
      }


      dispatch(
        searcPublicationsSlice.actions.setIDsOfPublicationsObjectSearch(
          arrIdsOfPublicationsByPart
        )
      );

      documentsSearch(arrIdsOfPublicationsByPart);
    } catch (err) {
      console.log(err);
    }
  };
  const documentsSearch = async (arrIdsOfPublications: any) => {
    setLoaderPublications(true);

    try {
      if (arrIdsOfPublications.length > 1) {
        arrIdsOfPublications = arrIdsOfPublications[count];
        setCount((prev) => prev + 1);
      }
      const res = await fetch(
        "https://gateway.scan-interfax.ru/api/v1/documents",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${tokenInLocalStorage}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ids: arrIdsOfPublications,
          }),
        }
      );
      if (res.status === 400) {
        setLoaderPublications(false);
      } else if (res.status === 200) {
        const result = await res.json();
        dispatch(
          searcPublicationsSlice.actions.setDocumetsPublications(result)
        );
        setLoaderPublications(false);
      }
    } catch (error) {
      setLoaderPublications(false);
      console.log(error);
    }
  };

  return {
    loaderUserAccount,
    userInfo, 
    setUserInfo,
    logInAccountHandleClick,
    searchHandleClick,
    loaderPublications,
    count,
    setCount,
    documentsSearch,
  };
};
export default useCustomHook;
