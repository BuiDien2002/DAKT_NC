import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Image, ScrollView} from 'react-native';
import database from '@react-native-firebase/database';
const App: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [temperature, setTemperature] = useState(0);
  const [salinity, setSalinity] = useState(0);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);
  const [data, setData] = useState<any[]>([]);

  // Define your ThingSpeak API key and channel ID
  const apiKey = 'ZKZYPKDTRVZX264Y';
  const channelID = '2300646';
  const fetchData = async () => {
    const apiUrl = `https://api.thingspeak.com/channels/${channelID}/feeds.json?api_key=${apiKey}&results=1`;
    try {
      const response = await fetch(apiUrl);
      const responsedata = await response.json();
      const {feeds} = responsedata;
      setData(feeds);
    } catch (error) {
      console.error('Error fetching data from ThingSpeak', error);
    }
  };
  useEffect(() => {
    const intervalId = setInterval(fetchData, 1000); // Polling every 1 seconds
    return () => {
      clearInterval(intervalId); // Cleanup when the component unmounts
    };
  }, [channelID, apiKey]);
  useEffect(() => {
    database()
      .ref('/temp')
      .on('value', snapshot => {
        setSalinity(snapshot.val());
      });
  }, [temperature]);
  useEffect(() => {
    database()
      .ref('/sal')
      .on('value', snapshot => {
        setTemperature(snapshot.val());
      });
  }, [salinity]);
  const getFormattedDate = () => {
    const options: Intl.DateTimeFormatOptions = {day: 'numeric'};
    return currentDate.toLocaleString('en-US', options);
  };
  const getFormattedMonth = () => {
    const options: Intl.DateTimeFormatOptions = {month: 'long'};
    return currentDate.toLocaleString('en-US', options);
  };
  const getFormattedYear = () => {
    const options: Intl.DateTimeFormatOptions = {year: 'numeric'};
    return currentDate.toLocaleString('en-US', options);
  };
  const getFormattedWeekday = () => {
    const options: Intl.DateTimeFormatOptions = {weekday: 'long'};
    return currentDate.toLocaleString('en-US', options);
  };
  return (
    <View style={styles.Vieww}>
      <View style={styles.day_month_year}>
        <Text style={styles.text_day_month}>{`
        ${getFormattedDate()} ${getFormattedMonth()}`}</Text>
        <Text style={styles.text_year}> {getFormattedYear()}</Text>
        <Image
          source={require('./assets/drop-down.png')}
          style={styles.image}
        />
      </View>
      <ScrollView style={styles.weekday}>
        <Text style={styles.text_weekday}>{getFormattedWeekday()}</Text>
      </ScrollView>
      <View style={styles.name}>
        <Text style={styles.text_name}>NHOM 1 DAKT_NC</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.Nhietdo_View}>TEMPERATURE</Text>
        <Text style={styles.Doman_View}>SALINITY</Text>
      </View>
      {data.map(item => (
        <View style={styles.View_hienthi_DoMan_Nhietdo} key={item.entry_id}>
          <Text style={styles.Nhietdo_text}>{item.field1}</Text>
          <Text style={styles.Doman_text}>{item.field2}</Text>
        </View>
      ))}
      <View style={styles.view_meo}>
        <Image source={require('./assets/meo.png')} style={styles.image_meo} />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  Vieww: {
    backgroundColor: 'linen',
    alignContent: 'center',
  },
  day_month_year: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
  },
  view_meo: {
    flexDirection: 'row',
    marginTop: 5,
    justifyContent: 'center',
    alignContent: 'center',
  },
  text_day_month: {
    color: 'midnightblue',
    fontSize: 26,
    fontWeight: '800',
  },
  image: {
    width: 24,
    height: 24,
    marginTop: 36,
  },
  weekday: {
    flexDirection: 'row',
    marginLeft: 34,
    marginBottom: 10,
  },
  text_weekday: {
    color: 'mediumblue',
    fontSize: 20,
    fontWeight: '600',
  },
  text_year: {
    color: 'deeppink',
    fontSize: 26,
    fontWeight: '800',
    marginTop: 31,
  },
  name: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
  },
  text_name: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: 'mintcream',
    color: 'green',
    fontSize: 40,
    fontWeight: '800',
    marginBottom: 7,
    alignContent: 'center',
  },
  image_meo: {
    width: 400,
    height: 480,
    flexShrink: 0,
  },
  View_button: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  Nhietdo_View: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: 'lemonchiffon',
    alignSelf: 'flex-start',
    marginHorizontal: '1%',
    marginBottom: 6,
    minWidth: '48%',
    textAlign: 'center',
    color: 'red',
    fontWeight: '700',
    fontSize: 20,
  },
  Doman_View: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: 'skyblue',
    alignSelf: 'flex-start',
    marginHorizontal: '1%',
    marginBottom: 6,
    minWidth: '48%',
    textAlign: 'center',
    color: 'yellow',
    fontWeight: '700',
    fontSize: 20,
  },
  Nhietdo_text: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginHorizontal: '1%',
    marginBottom: 6,
    minWidth: '48%',
    textAlign: 'center',
    color: 'red',
    fontSize: 33,
    fontWeight: '800',
  },
  Doman_text: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginHorizontal: '1%',
    marginBottom: 6,
    minWidth: '48%',
    textAlign: 'center',
    color: 'yellow',
    fontWeight: '800',
    fontSize: 33,
  },
  View_hienthi_DoMan_Nhietdo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: 'teal',
  },
});
export default App;
