import { useEffect, useState } from 'react';
import { getDatabase, ref, query, orderByChild, limitToLast, onValue } from 'firebase/database';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogClose } from '@/components/ui/dialog';

// Helper function to format timestamps
const formatTimestamp = (timestamp: number) => {
  const date = new Date(timestamp);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};

const calculateAge = (birthDay: string) => {
  const birthDate = new Date(
    `${birthDay.substring(4, 8)}-${birthDay.substring(2, 4)}-${birthDay.substring(0, 2)}`
  );
  const currentDate = new Date();
  let age = currentDate.getFullYear() - birthDate.getFullYear();
  const monthDifference = currentDate.getMonth() - birthDate.getMonth();

  if (monthDifference < 0 || (monthDifference === 0 && currentDate.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
};

const Last5Files = () => {
  const [files, setFiles] = useState<any[]>([]);
  const [singleValidationNICs, setSingleValidationNICs] = useState<any[]>([]);
  const [selectedNic, setSelectedNic] = useState<any | null>(null);
  const [nicDetails, setNicDetails] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [invalidNICs, setInvalidNICs] = useState<any[]>([]); // To hold invalid NICs
  const [validatedNICs, setValidatedNICs] = useState<any>({}); // To hold validated NICs

  useEffect(() => {
    const db = getDatabase();

    // Fetch the last 10 single validation NICs
    const singleValidationRef = ref(db, 'validated_nics');
    const singleValidationQuery = query(singleValidationRef, orderByChild('validationType'), limitToLast(10));

    onValue(singleValidationQuery, snapshot => {
      if (snapshot.exists()) {
        const validatedData = snapshot.val();
        const singleValidationData = Object.values(validatedData).filter((entry: any) => entry.validationType === "single validation");
        setSingleValidationNICs(singleValidationData); // Store single validation NICs
      }
    });

    // Fetch the uploaded files and NICs data from Firebase
    const filesRef = ref(db, 'uploaded_files');
    const filesQuery = query(filesRef, orderByChild('first_created_timestamp'), limitToLast(5));

    const unsubscribe = onValue(filesQuery, snapshot => {
      if (snapshot.exists()) {
        const filesData = snapshot.val();
        console.log('Fetched files data:', filesData);

        const formattedFiles = Object.keys(filesData).map(key => ({
          ...filesData[key],
          id: key,
          formattedTimestamp: formatTimestamp(Number(filesData[key].first_created_timestamp))
        }));
        setFiles(formattedFiles.reverse()); // Reverse to show the latest first
      }
    });

    // Fetch invalid NICs
    const invalidNICsRef = ref(db, 'invalid_nics');
    const validatedNICsRef = ref(db, 'validated_nics');

    onValue(validatedNICsRef, (validatedSnapshot) => {
      let validatedNICSet = new Set();
      if (validatedSnapshot.exists()) {
        validatedNICSet = new Set(Object.values(validatedSnapshot.val()).map((entry: any) => entry.nic));
      }

      onValue(invalidNICsRef, (invalidSnapshot) => {
        if (invalidSnapshot.exists()) {
          const invalidData = Object.values(invalidSnapshot.val()).filter((entry: any) => !validatedNICSet.has(entry.nic));
          setInvalidNICs(invalidData);
        }
      });
    });

    // Fetch validated NICs
    onValue(validatedNICsRef, snapshot => {
      if (snapshot.exists()) {
        const validatedData = snapshot.val();
        setValidatedNICs(validatedData); // Store validated NICs
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Fetch NIC details when clicking on a NIC
  const fetchNicDetails = (nic: string) => {
    setLoading(true);
    const db = getDatabase();
    const nicRef = ref(db, 'validated_nics');

    onValue(nicRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const nicEntry = Object.values(data).find((entry: any) => entry.nic === nic);
        if (nicEntry) {
          setNicDetails(nicEntry);
        } else {
          setNicDetails(null);
        }
      }
      setLoading(false);
    });
  };

  return (
    <div className="flex flex-col">
      {/* Last 10 Single Validation NICs */}
      <h2 className="text-2xl font-semibold mb-4 text-primary">Last 10 Single Validation NICs</h2>
      {singleValidationNICs.length === 0 ? (
        <p className="text-md text-primary">No single validation NICs available.</p>
      ) : (
        <div className="flex gap-4 flex-wrap">
          {singleValidationNICs.map((nicData: any) => (
            <motion.div
              key={nicData.nic}
              className="p-2 mb-4 border-4 border-gray-300 dark:border-gray-800 rounded-lg shadow-sm w-auto"
              whileHover={{ scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 250 }}
            >
              <div className="flex justify-between items-center">
                <span className="text-sm text-primary">
                  {formatTimestamp(Number(nicData.first_created_timestamp))}
                </span>
              </div>
              <Dialog>
                <DialogTrigger
                  onClick={() => {
                    setSelectedNic(nicData.nic);
                    setNicDetails(null);
                    fetchNicDetails(nicData.nic);
                  }}
                  className={`text-gray-500 underline cursor-pointer ${nicData.error ? 'text-red-400' : 'text-green-400'} hover:text-white-500`}
                >
                  <span className="whitespace-nowrap text-sm text-primary dark:text-gray-100">{nicData.nic}</span>
                </DialogTrigger>
                <DialogContent className="p-4">
                  {(() => {
                    if (nicData.error) {
                      return (
                        <>
                          <DialogTitle className="text-xl text-red-500">Invalid NIC Details</DialogTitle>
                          <div className="space-y-3">
                            <p><strong>NIC:</strong> {nicData.nic}</p>
                            <p><strong>Error:</strong> {nicData.error}</p>
                            <p><strong>Duplicate Count:</strong> {nicData.duplicate_count}</p>
                          </div>
                          <DialogClose asChild>
                            <button className="mt-4 text-white bg-red-500 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-500 rounded px-4 py-2">Close</button>
                          </DialogClose>
                        </>
                      );
                    } else {
                      return (
                        <>
                          <DialogTitle className="text-xl text-green-500">NIC Details</DialogTitle>
                          <div className="space-y-3">
                            <p><strong>NIC:</strong> {nicData.nic}</p>
                            <p><strong>Gender:</strong> {nicData.gender}</p>
                            <p><strong>Birth Year:</strong> {nicData.birthYear}</p>
                            <p><strong>Birth Day:</strong> {nicData.birthDay}</p>
                            <p><strong>Age:</strong> {calculateAge(nicData.birthDay)}</p>
                            <p><strong>Voting Eligibility:</strong> {nicData.votingEligibility === "Unknown" ? "Unknown" : nicData.votingEligibility === true ? "Eligible" : nicData.votingEligibility === false ? "Ineligible" : "Unknown"}</p>
                            <p><strong>Serial Number:</strong> {nicData.serialNumber}</p>
                            <p><strong>Check Digit:</strong> {nicData.checkDigit}</p>
                            <p><strong>IP:</strong> {nicData.ip}</p>
                            <p><strong>City:</strong> {nicData.city}</p>
                            <p><strong>Region:</strong> {nicData.region}</p>
                            <p><strong>Country:</strong> {nicData.country}</p>
                            <p><strong>Location:</strong> {nicData.location.latitude}, {nicData.location.longitude}</p>
                            <p><strong>Organization:</strong> {nicData.organization}</p>
                          </div>
                          <DialogClose asChild>
                            <button className="mt-4 text-white bg-green-500 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-500 rounded px-4 py-2">Close</button>
                          </DialogClose>
                        </>
                      );
                    }
                  })()}
                </DialogContent>
              </Dialog>
            </motion.div>
          ))}
        </div>
      )}

      {/* Last 5 Uploaded Files */}
      <h2 className="text-2xl font-semibold mb-4 text-primary">Last 5 Uploaded Files</h2>
      {files.length === 0 ? (
        <p className='text-md text-primary'>No files uploaded recently.</p>
      ) : (
        <div className="flex gap-4 flex-wrap">
          {files.map(file => (
            <motion.div
              key={file.id}
              className="p-2 border-4 border-gray-300 dark:border-gray-800 rounded-lg shadow-sm w-auto"
              whileHover={{ scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 250 }}
            >
              <div className="flex justify-between items-center">
                <span className="text-primary font-medium">{file.fileName}</span>
                <span className="text-sm text-primary">{file.formattedTimestamp}</span>
              </div>
              <div className="mt-2">
                <span className="text-sm text-primary dark:text-gray-100">
                  {file.nics && Array.isArray(file.nics) ? file.nics.length : 0} NIC(s)
                </span>
                <div className="mt-2 flex gap-2 flex-wrap text-justify">
                  {file.nics && Array.isArray(file.nics) && file.nics.map((nic: string) => {
                    const invalidNic = invalidNICs.find((item) => item.nic === nic);
                    const validatedNic = validatedNICs[nic];

                    return (
                      <div
                        key={nic}
                        className={`p-2 rounded-lg ${invalidNic ? 'bg-red-100 dark:bg-red-800' : validatedNic ? 'bg-green-100 dark:bg-green-800' : 'bg-gray-100 dark:bg-gray-700'} shadow-sm`}
                      >
                        <Dialog>
                          <DialogTrigger
                            onClick={() => {
                              setSelectedNic(nic);
                              setNicDetails(null);
                              fetchNicDetails(nic);
                            }}
                            className={`text-gray-500 underline cursor-pointer ${invalidNic ? 'text-red-400' : validatedNic ? 'text-green-400' : ''} hover:text-white-500`}
                          >
                            <span className="whitespace-nowrap text-sm text-primary dark:text-gray-100">{nic}</span>
                          </DialogTrigger>
                          <DialogContent className="p-4">
                            {(() => {
                              if (invalidNic) {
                                return (
                                  <>
                                    <DialogTitle className="text-xl text-red-500">Invalid NIC Details</DialogTitle>
                                    <div className="space-y-3">
                                      <p><strong>NIC:</strong> {invalidNic.nic}</p>
                                      <p><strong>Error:</strong> {invalidNic.error}</p>
                                      <p><strong>Duplicate Count:</strong> {invalidNic.duplicate_count}</p>
                                    </div>
                                    <DialogClose asChild>
                                      <button className="mt-4 text-white bg-red-500 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-500 rounded px-4 py-2">Close</button>
                                    </DialogClose>
                                  </>
                                );
                              } else if (validatedNic) {
                                return (
                                  <>
                                    <DialogTitle className="text-xl text-green-500">NIC Details</DialogTitle>
                                    <div className="space-y-3">
                                      <p><strong>NIC:</strong> {validatedNic.nic}</p>
                                      <p><strong>Gender:</strong> {validatedNic.gender}</p>
                                      <p><strong>Birth Date:</strong> {validatedNic.birthDay}</p>
                                      <p><strong>Age:</strong> {calculateAge(validatedNic.birthDay)}</p>
                                      <p><strong>Voting Eligibility:</strong> {validatedNic.votingEligibility === "Unknown" ? "Unknown" : validatedNic.votingEligibility === true ? "Eligible" : validatedNic.votingEligibility === false ? "Ineligible" : "Unknown"}</p>
                                      <p><strong>Serial Number:</strong> {validatedNic.serialNumber}</p>
                                      <p><strong>Check Digit:</strong> {validatedNic.checkDigit}</p>
                                      <p><strong>IP:</strong> {validatedNic.ip}</p>
                                      <p><strong>City:</strong> {validatedNic.city}</p>
                                      <p><strong>Region:</strong> {validatedNic.region}</p>
                                      <p><strong>Country:</strong> {validatedNic.country}</p>
                                      <p><strong>Location:</strong> {validatedNic.location.latitude}, {validatedNic.location.longitude}</p>
                                      <p><strong>Organization:</strong> {validatedNic.organization}</p>
                                      {loading && <div className="animate-spin text-gray-500 dark:text-gray-300">Loading...</div>}
                                    </div>
                                    <DialogClose asChild>
                                      <button className="mt-4 text-white bg-green-500 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-500 rounded px-4 py-2">Close</button>
                                    </DialogClose>
                                  </>
                                );
                              } else {
                                return <p className="text-sm text-gray-500 dark:text-gray-300">No NIC details available</p>;
                              }
                            })()}
                          </DialogContent>
                        </Dialog>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Last5Files;