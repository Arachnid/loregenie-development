import fs from 'fs';
import { ChatCompletionMessageParam } from 'openai/resources';
import path from 'path';

/**
 * Updates or writes data to a file, with the filename being the provided ID.
 * @param id The unique identifier for the data.
 * @param newData The new conversation data to be stored or appended.
 * @param directory The directory where the file will be stored.
 */
export default function writeDataToFile(id: string, newData: Array<ChatCompletionMessageParam>, directory = './data', reset=false) {
  const filePath = path.join(directory, `${id}.json`);

  // Ensure the directory exists
  fs.mkdirSync(directory, { recursive: true });

  // Check if the file exists
  if (fs.existsSync(filePath)) {
    // Read the existing file
    fs.readFile(filePath, 'utf8', (readErr, fileData) => {
      if (readErr) {
        console.error('Error reading file:', readErr);
        return;
      }

      // Parse the existing data and merge with new data
      let existingData = JSON.parse(fileData);
      let updatedData = [...existingData, ...newData];
      if(reset) {
       updatedData = [ ...newData];
      }
      

      // Write the updated data back to the file
      fs.writeFile(filePath, JSON.stringify(updatedData, null, 2), 'utf8', (writeErr) => {
        if (writeErr) {
          console.error('Error writing file:', writeErr);
        } else {
          console.log(`Data for ID ${id} updated successfully.`);
        }
      });
    });
  } else {
    // If the file does not exist, write the new data
    fs.writeFile(filePath, JSON.stringify(newData, null, 2), 'utf8', (err) => {
      if (err) {
        console.error('Error writing file:', err);
      } else {
        console.log(`Data for ID ${id} saved successfully.`);
      }
    });
  }
}


export function readDataFromFile(id: string, directory = './data'): Promise<Array<ChatCompletionMessageParam>> {
    return new Promise((resolve, reject) => {
      const filePath = path.join(process.cwd(), directory, `${id}.json`);
  
      // Check if the file exists
      if (!fs.existsSync(filePath)) {
        console.log('file doesnt exist ')
        return reject(new Error(`File not found for ID ${id}`));
      }
  
      // Read the file
      fs.readFile(filePath, 'utf8', (err, fileData) => {
        if (err) {
          return reject(err);
        }
  
        try {
          // Parse the file data as JSON
          const data = JSON.parse(fileData);
          resolve(data);
        } catch (parseErr) {
          reject(parseErr);
        }
      });
    });
  }