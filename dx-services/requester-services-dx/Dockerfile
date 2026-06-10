FROM egovio/apline-jre:8u121
MAINTAINER Senthil<senthil.kalimuthu@tarento.com>

COPY ${WORK_DIR}/pom.xml ./pom.xml
COPY build/maven/start.sh ./start.sh

COPY ${WORK_DIR}/src ./src
RUN mvn -B -f /app/pom.xml package


FROM amazoncorretto:17-alpine

WORKDIR /opt/egov

COPY Test-Class3DocumentSigner2014.pfx /tmp/esign-configs/
RUN mkdir -p /tmp/esign-tmp/
RUN chmod 777 /tmp/esign-tmp/
RUN mkdir -p /tmp/esign-output/
RUN chmod 777 /tmp/esign-output/
#copy /ds /etc/
COPY PRENIOUA.lic /tmp/esign-configs/

COPY --from=build /app/target/*.jar /app/start.sh /opt/egov/
RUN chmod +x /usr/bin/start.sh
CMD ["/usr/bin/start.sh"]
# NOTE: the two 'RUN' commands can probably be combined inside of a single
# script (i.e. RUN build-and-install-app.sh) so that we can also clean up the
# extra files created during the `mvn package' command. that step inflates the
# resultant image by almost 1.0GB.

