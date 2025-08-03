import { Dimensions, StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons'; // or from 'react-native-vector-icons'
import React from 'react';

const { width, height } = Dimensions.get('window');

const GroupCard = ({
  item,
  navigation,
  setGroupToDelete,
  setShowDeleteConfirm,
  setSelectedGroupId,
  setIsAddMemberModalVisible,
  fetchMembers,
  setShowMemberPopup,
  tripTotals,
  memberCounts,
}) => {
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('GroupExpanseScreen', { ...item })}
      style={styles.card}
    >
      <View style={styles.rowBetween}>
        {/* Left Section */}
        <View style={styles.leftGroup}>
          <TouchableOpacity
            onPress={() => {
              setGroupToDelete(item.id);
              setShowDeleteConfirm(true);
            }}
            style={styles.deleteBtn}
          >
            <MaterialIcons name="delete-outline" size={24} color="red" />
          </TouchableOpacity>

          <Image
            source={randemImage()}
            style={styles.groupImage}
          />
          <View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subTitle}>Group Spend</Text>
            <Text style={styles.amount}>₹ {tripTotals[item.id]?.toFixed(2) || 0}</Text>
          </View>
        </View>

        {/* Right Section */}
        <View style={styles.rightGroup}>
          {/* Avatars + Add Member */}
          <TouchableOpacity
            onPress={() => {
              setSelectedGroupId(item.id);
              setIsAddMemberModalVisible(true);
            }}
            style={styles.avatarRow}
          >
            <View style={styles.avatarStack}>
              <Image source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEvkMZtGOAhpFvkJeuC-pRRrFFaQ9nL0NRTqoBAhLgzGxBwM-29_a4s5R0WwfDIg-1BOk&usqp=CAU' }} style={[styles.circle, { left: -40 }]} />
              <Image source={{ uri: 'https://static.vecteezy.com/system/resources/thumbnails/002/002/257/small_2x/beautiful-woman-avatar-character-icon-free-vector.jpg' }} style={[styles.circle, { left: -20 }]} />
              <Image source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6W8j59cb5rvLX_rYPVcqZ67MVfShKc87w1IafvcFi0_7ytM4mGshNvIZjJFC5RMiEfqw&usqp=CAU' }} style={[styles.circle, { left: 0 }]} />
            </View>
            <View style={styles.addIcon}>
              <Feather name="plus-circle" size={20} color='#f0e8e8ff' />
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {
            setSelectedGroupId(item.id);
            setIsAddMemberModalVisible(true);
          }}>
            <Text style={styles.addText}>Add Member</Text>
          </TouchableOpacity>

          {/* Buttons */}
          <TouchableOpacity
            onPress={() => navigation.navigate('GroupExpanseScreen', { ...item })}
            style={styles.actionBtn}
          >
            <Text style={styles.btnText}>Add Expenses +</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={async () => {
              setSelectedGroupId(item.id);
              await fetchMembers(item.id);
              setShowMemberPopup(true);
            }}
            style={styles.actionBtn}
          >
            <Text style={styles.btnText}>{memberCounts[item.id] || 0} Member Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f2f3f5',
    borderRadius: 10,
    marginHorizontal: width * 0.04,
    marginTop: height * 0.02,
    padding: width * 0.04,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
  },
  deleteBtn: {
    padding: 6,
    backgroundColor: '#d6d0d0',
    borderRadius: 50,
    marginRight: 5,
  },
  groupImage: {
    width: 40,
    height: 40,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  title: {
    fontWeight: '800',
    fontSize: 14,
  },
  subTitle: {
    fontWeight: '600',
    color: 'green',
    fontSize: 12,
  },
  amount: {
    fontWeight: '600',
    color: '#db4649',
  },
  rightGroup: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  avatarStack: {
    flexDirection: 'row',
    position: 'relative',
    width: 60,
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    position: 'absolute',
    borderWidth: 1,
    borderColor: '#fff',
  },
  addIcon: {
    backgroundColor: 'gray',
    borderRadius: 50,
    padding: 4,
    marginLeft: 10,
  },
  addText: {
    fontSize: 12,
    marginTop: 3,
    color: '#000',
  },
  actionBtn: {
    backgroundColor: '#c4c0c0',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  btnText: {
    fontSize: 12,
    color: '#000',
  },
});

export default GroupCard;
