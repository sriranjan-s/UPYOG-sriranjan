package org.egov.chat.util;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FilenameUtils;
import org.junit.Test;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.io.IOException;

@Slf4j
public class FileStoreTest {


    @Test
    public void test() throws IOException {

    }


    @Test
    public void fileBase64TransformTest() throws IOException {

    }

    @Test
    public void readEncodedFile() throws IOException {

    }


    HttpHeaders getDefaultHttpHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authentication", "Bearer s6iyrz5y8rPApBQ2gQ3oog==");
        return headers;
    }

    @Test
    public void testFilename() {
        String fileURL = "https://egov-rainmaker.s3.ap-south-1.amazonaws.com/pb/chatbot/July/22/1563780014746chatbot8753939779645334441.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20190722T084923Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=AKIA42DEGMQ2NZVNTLNI%2F20190722%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Signature=47995ad12fbd041b2b6107ecc071250e7555de63cb16637146852671d8c74118";
        String filename = FilenameUtils.getName(fileURL);
        filename = filename.substring(13, filename.indexOf("?"));
        System.out.println(filename);
    }

}